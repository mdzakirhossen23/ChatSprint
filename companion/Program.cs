using System.Diagnostics;
using System.Net.WebSockets;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.Win32;

namespace ChatSprintObsCompanion;

internal static class Program
{
    private const string Protocol = "chatsprintobs";
    private const string ObsPath = @"C:\Program Files\obs-studio\bin\64bit\obs64.exe";
    private const string OverlayUrl = "https://chattprint.baharsoftbd.com/overlay";
    private const string SceneCollection = "Untitled";
    private const string Profile = "Untitled";
    private const string Scene = "Scene";

    [STAThread]
    private static async Task Main(string[] args)
    {
        ApplicationConfiguration.Initialize();
        try
        {
            var argument = args.FirstOrDefault() ?? "--install";
            if (argument is "--install" or "--install-silent")
            {
                Install(argument == "--install-silent");
                return;
            }

            var action = ParseAction(argument);
            switch (action)
            {
                case "start": await StartLive(); break;
                case "stop": await StopLive(); break;
                case "status": await ShowStatus(); break;
                case "configure": await ConfigureObsScene(); break;
                case "configure-silent": await ConfigureObsScene(true); break;
                default: Show("অজানা নির্দেশ পাওয়া গেছে।", MessageBoxIcon.Warning); break;
            }
        }
        catch (Exception error)
        {
            Show($"কাজটি সম্পন্ন হয়নি।\n\n{error.Message}", MessageBoxIcon.Error);
        }
    }

    private static string ParseAction(string value)
    {
        if (Uri.TryCreate(value, UriKind.Absolute, out var uri) && uri.Scheme.Equals(Protocol, StringComparison.OrdinalIgnoreCase))
            return string.IsNullOrWhiteSpace(uri.Host) ? uri.AbsolutePath.Trim('/') : uri.Host;
        return value.TrimStart('-', '/').ToLowerInvariant();
    }

    private static void Install(bool silent)
    {
        var installDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "ChatSprint");
        Directory.CreateDirectory(installDir);
        var installedExe = Path.Combine(installDir, "ChatSprintObsCompanion.exe");
        var currentExe = Environment.ProcessPath ?? throw new InvalidOperationException("Companion path পাওয়া যায়নি।");
        if (!Path.GetFullPath(currentExe).Equals(Path.GetFullPath(installedExe), StringComparison.OrdinalIgnoreCase))
            File.Copy(currentExe, installedExe, true);

        using var protocolKey = Registry.CurrentUser.CreateSubKey($@"Software\Classes\{Protocol}");
        protocolKey.SetValue("", "URL:ChatSprint OBS Companion");
        protocolKey.SetValue("URL Protocol", "");
        using var iconKey = protocolKey.CreateSubKey("DefaultIcon");
        iconKey.SetValue("", $"\"{installedExe}\",0");
        using var commandKey = protocolKey.CreateSubKey(@"shell\open\command");
        commandKey.SetValue("", $"\"{installedExe}\" \"%1\"");

        EnableObsWebSocket();
        if (!silent) Show("ChatSprint OBS Companion প্রস্তুত।\n\nএখন ChatSprint অ্যাপের ‘লাইভ শুরু করুন’ বাটন ব্যবহার করা যাবে।", MessageBoxIcon.Information);
    }

    private static async Task StartLive()
    {
        EnsureObsReady();
        if (Process.GetProcessesByName("obs64").Length == 0)
        {
            var info = new ProcessStartInfo
            {
                FileName = ObsPath,
                WorkingDirectory = Path.GetDirectoryName(ObsPath)!,
                Arguments = $"--startstreaming --minimize-to-tray --collection \"{SceneCollection}\" --profile \"{Profile}\" --scene \"{Scene}\"",
                UseShellExecute = true
            };
            Process.Start(info);
            Show("OBS background-এ চালু হচ্ছে এবং Twitch live শুরু করছে।\n\nChatSprint control room থেকে এখন প্রশ্ন পরিচালনা করুন।", MessageBoxIcon.Information);
            return;
        }

        await ConfigureObsScene(true);
        var response = await SendObsRequest("StartStream");
        Show(response ? "Twitch live শুরু হয়েছে।" : "OBS চালু আছে, কিন্তু streaming শুরু করা যায়নি। OBS একবার বন্ধ করে আবার ‘লাইভ শুরু করুন’ চাপুন।", response ? MessageBoxIcon.Information : MessageBoxIcon.Warning);
    }

    private static async Task StopLive()
    {
        if (Process.GetProcessesByName("obs64").Length == 0)
        {
            Show("OBS এখন চালু নেই।", MessageBoxIcon.Information);
            return;
        }
        var response = await SendObsRequest("StopStream");
        Show(response ? "Twitch live বন্ধ হয়েছে। OBS background-এ চালু আছে।" : "Streaming বন্ধ করা যায়নি। OBS-এর Stop Streaming বাটন ব্যবহার করুন।", response ? MessageBoxIcon.Information : MessageBoxIcon.Warning);
    }

    private static async Task ShowStatus()
    {
        if (Process.GetProcessesByName("obs64").Length == 0)
        {
            Show("OBS বন্ধ আছে।", MessageBoxIcon.Information);
            return;
        }
        var response = await SendObsRequest("GetStreamStatus", returnOutputState: true);
        Show(response ? "OBS চালু এবং Twitch live চলছে।" : "OBS চালু আছে, কিন্তু Twitch live বন্ধ।", MessageBoxIcon.Information);
    }

    private static async Task ConfigureObsScene(bool silent = false)
    {
        EnsureObsReady();
        if (Process.GetProcessesByName("obs64").Length == 0)
        {
            if (!silent) Show("OBS দৃশ্য প্রস্তুত করা হয়েছে। OBS চালু হলে Twitch-এ শুধু ChatSprint কুইজ দেখা যাবে।", MessageBoxIcon.Information);
            return;
        }

        var list = await SendObsRequestRaw("GetSceneItemList", new JsonObject { ["sceneName"] = Scene });
        var items = list?["sceneItems"]?.AsArray();
        var browserFound = false;
        if (items is not null)
        {
            foreach (var node in items)
            {
                var item = node?.AsObject();
                var sourceName = item?["sourceName"]?.GetValue<string>() ?? "";
                var sourceKind = item?["inputKind"]?.GetValue<string>() ?? "";
                var itemId = item?["sceneItemId"]?.GetValue<int>() ?? -1;
                if (itemId < 0) continue;

                if (sourceKind.Equals("monitor_capture", StringComparison.OrdinalIgnoreCase) || sourceName.Contains("Display Capture", StringComparison.OrdinalIgnoreCase))
                    await SendObsRequestRaw("SetSceneItemEnabled", new JsonObject { ["sceneName"] = Scene, ["sceneItemId"] = itemId, ["sceneItemEnabled"] = false });

                if (sourceKind.Equals("browser_source", StringComparison.OrdinalIgnoreCase) || sourceName.Equals("Browser", StringComparison.OrdinalIgnoreCase))
                {
                    browserFound = true;
                    await SendObsRequestRaw("SetInputSettings", new JsonObject
                    {
                        ["inputName"] = sourceName,
                        ["inputSettings"] = new JsonObject { ["url"] = OverlayUrl, ["width"] = 1920, ["height"] = 1080 },
                        ["overlay"] = true
                    });
                    await SendObsRequestRaw("SetSceneItemEnabled", new JsonObject { ["sceneName"] = Scene, ["sceneItemId"] = itemId, ["sceneItemEnabled"] = true });
                    await SendObsRequestRaw("SetSceneItemLocked", new JsonObject { ["sceneName"] = Scene, ["sceneItemId"] = itemId, ["sceneItemLocked"] = true });
                }
            }
        }
        await SendObsRequestRaw("SetCurrentProgramScene", new JsonObject { ["sceneName"] = Scene });
        if (!silent) Show(browserFound ? "OBS ঠিক করা হয়েছে। Twitch-এ এখন শুধু ChatSprint প্রশ্ন, উত্তর ও স্কোর দেখা যাবে।" : "OBS Browser Source পাওয়া যায়নি।", browserFound ? MessageBoxIcon.Information : MessageBoxIcon.Warning);
    }

    private static void EnsureObsReady()
    {
        if (!File.Exists(ObsPath)) throw new FileNotFoundException("OBS Studio পাওয়া যায়নি।", ObsPath);
        var scenePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "obs-studio", "basic", "scenes", $"{SceneCollection}.json");
        if (!File.Exists(scenePath)) throw new FileNotFoundException("ChatSprint OBS scene পাওয়া যায়নি।", scenePath);
        var sceneText = File.ReadAllText(scenePath);
        if (!sceneText.Contains(OverlayUrl, StringComparison.OrdinalIgnoreCase))
            throw new InvalidOperationException("OBS Browser Source-এ ChatSprint overlay পাওয়া যায়নি।");
        PrepareSceneFile(scenePath);
        EnableObsWebSocket();
    }

    private static void PrepareSceneFile(string scenePath)
    {
        var root = JsonNode.Parse(File.ReadAllText(scenePath))?.AsObject();
        if (root is null) return;
        var backup = scenePath + ".chatsprint-backup";
        if (!File.Exists(backup)) File.Copy(scenePath, backup);

        var sourceKinds = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        if (root["sources"] is JsonArray sources)
        {
            foreach (var node in sources)
            {
                var source = node?.AsObject();
                if (source is null) continue;
                var name = source["name"]?.GetValue<string>() ?? "";
                var kind = source["id"]?.GetValue<string>() ?? "";
                sourceKinds[name] = kind;
                if (kind.Equals("browser_source", StringComparison.OrdinalIgnoreCase))
                {
                    var settings = source["settings"]?.AsObject() ?? new JsonObject();
                    settings["url"] = OverlayUrl;
                    settings["width"] = 1920;
                    settings["height"] = 1080;
                    source["settings"] = settings;
                }
            }

            foreach (var node in sources)
            {
                var source = node?.AsObject();
                if (source?["id"]?.GetValue<string>() != "scene") continue;
                if (source["settings"]?["items"] is not JsonArray items) continue;
                foreach (var itemNode in items)
                {
                    var item = itemNode?.AsObject();
                    var name = item?["name"]?.GetValue<string>() ?? "";
                    sourceKinds.TryGetValue(name, out var kind);
                    if (kind == "monitor_capture" || name.Contains("Display Capture", StringComparison.OrdinalIgnoreCase)) item!["visible"] = false;
                    if (kind == "browser_source" || name.Equals("Browser", StringComparison.OrdinalIgnoreCase))
                    {
                        item!["visible"] = true;
                        item["locked"] = true;
                    }
                }
            }
        }
        File.WriteAllText(scenePath, root.ToJsonString(new JsonSerializerOptions { WriteIndented = true }));
    }

    private static string ObsWebSocketConfigPath => Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "obs-studio", "plugin_config", "obs-websocket", "config.json");

    private static void EnableObsWebSocket()
    {
        if (!File.Exists(ObsWebSocketConfigPath)) return;
        var root = JsonNode.Parse(File.ReadAllText(ObsWebSocketConfigPath))?.AsObject();
        if (root is null) return;
        var backup = ObsWebSocketConfigPath + ".chatsprint-backup";
        if (!File.Exists(backup)) File.Copy(ObsWebSocketConfigPath, backup);
        root["server_enabled"] = true;
        File.WriteAllText(ObsWebSocketConfigPath, root.ToJsonString(new JsonSerializerOptions { WriteIndented = true }));
    }

    private static async Task<bool> SendObsRequest(string requestType, bool returnOutputState = false)
    {
        var responseData = await SendObsRequestRaw(requestType);
        if (responseData is null) return false;
        return returnOutputState ? responseData["outputActive"]?.GetValue<bool>() == true : true;
    }

    private static async Task<JsonObject?> SendObsRequestRaw(string requestType, JsonObject? requestData = null)
    {
        try
        {
            var config = JsonNode.Parse(await File.ReadAllTextAsync(ObsWebSocketConfigPath))?.AsObject();
            var password = config?["server_password"]?.GetValue<string>() ?? "";
            var port = config?["server_port"]?.GetValue<int>() ?? 4455;
            using var socket = new ClientWebSocket();
            using var timeout = new CancellationTokenSource(TimeSpan.FromSeconds(5));
            await socket.ConnectAsync(new Uri($"ws://127.0.0.1:{port}"), timeout.Token);

            var hello = await Receive(socket, timeout.Token);
            var authentication = hello?["d"]?["authentication"];
            string? authValue = null;
            if (authentication is not null)
            {
                var salt = authentication["salt"]?.GetValue<string>() ?? "";
                var challenge = authentication["challenge"]?.GetValue<string>() ?? "";
                authValue = CreateAuthentication(password, salt, challenge);
            }
            var identify = new JsonObject { ["op"] = 1, ["d"] = new JsonObject { ["rpcVersion"] = 1 } };
            if (authValue is not null) identify["d"]!["authentication"] = authValue;
            await Send(socket, identify, timeout.Token);
            var identified = await Receive(socket, timeout.Token);
            if (identified?["op"]?.GetValue<int>() != 2) return null;

            var requestId = Guid.NewGuid().ToString("N");
            var request = new JsonObject { ["requestType"] = requestType, ["requestId"] = requestId };
            if (requestData is not null) request["requestData"] = requestData;
            await Send(socket, new JsonObject { ["op"] = 6, ["d"] = request }, timeout.Token);
            while (true)
            {
                var message = await Receive(socket, timeout.Token);
                if (message?["op"]?.GetValue<int>() != 7 || message["d"]?["requestId"]?.GetValue<string>() != requestId) continue;
                var ok = message["d"]?["requestStatus"]?["result"]?.GetValue<bool>() == true;
                if (!ok) return null;
                return message["d"]?["responseData"]?.AsObject() ?? new JsonObject();
            }
        }
        catch { return null; }
    }

    private static string CreateAuthentication(string password, string salt, string challenge)
    {
        var secret = Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(password + salt)));
        return Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(secret + challenge)));
    }

    private static async Task Send(ClientWebSocket socket, JsonObject value, CancellationToken token)
    {
        var bytes = Encoding.UTF8.GetBytes(value.ToJsonString());
        await socket.SendAsync(bytes, WebSocketMessageType.Text, true, token);
    }

    private static async Task<JsonNode?> Receive(ClientWebSocket socket, CancellationToken token)
    {
        using var stream = new MemoryStream();
        var buffer = new byte[8192];
        WebSocketReceiveResult result;
        do
        {
            result = await socket.ReceiveAsync(buffer, token);
            stream.Write(buffer, 0, result.Count);
        } while (!result.EndOfMessage);
        return JsonNode.Parse(Encoding.UTF8.GetString(stream.ToArray()));
    }

    private static void Show(string message, MessageBoxIcon icon) => MessageBox.Show(message, "ChatSprint OBS", MessageBoxButtons.OK, icon);
}
