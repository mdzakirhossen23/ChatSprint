$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Speech

$outputDir = Join-Path $PSScriptRoot 'outputs\narration'
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

$segments = @(
    @{ Start = 1; Text = 'Meet ChatSprint, a multilingual live quiz studio that turns ordinary Twitch chat into an interactive game for every viewer.' },
    @{ Start = 16; Text = 'The Go Live workspace brings the Twitch channel, OBS overlay address, automatic readiness checks, and live controls together in one guided setup.' },
    @{ Start = 31; Text = 'The streamer control room shows the active question, answer choices, response totals, and the live viewer panel side by side.' },
    @{ Start = 46; Text = 'Two independent timers can reveal the correct answer and start the next question automatically. The host can also control both steps manually.' },
    @{ Start = 61; Text = 'Questions advance automatically, so the quiz can continue smoothly without the streamer repeatedly pressing control buttons.' },
    @{ Start = 76; Text = 'Viewers answer directly in Twitch chat using A, B, C, or D, with or without an exclamation mark. No separate viewer app is required.' },
    @{ Start = 91; Text = 'A real Twitch chat answer is received instantly, matched to the current question, and converted into a live score.' },
    @{ Start = 106; Text = 'When the answer is revealed, ChatSprint clearly marks correct and wrong choices, updates each viewer result, and refreshes the leaderboard.' },
    @{ Start = 121; Text = 'The complete interface can switch to Bengali, English, Arabic, Dutch, or German, making the same live game accessible to more communities.' },
    @{ Start = 136; Text = 'Arabic includes right to left layout support, while every language keeps the controls and broadcast view synchronized.' },
    @{ Start = 151; Text = 'The searchable question bank lets creators add, edit, and delete quiz content. Language handling and game reset checks are managed automatically.' },
    @{ Start = 166; Text = 'The broadcast page provides a clean OBS ready overlay with the question, answers, results, and leaderboard, without exposing host controls.' },
    @{ Start = 181; Text = 'ChatSprint. One chat, five languages, one live game.' }
)

$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SelectVoice('Microsoft Zira Desktop')
$synth.Rate = 0
$synth.Volume = 100

try {
    for ($i = 0; $i -lt $segments.Count; $i++) {
        $path = Join-Path $outputDir ("segment-{0:D2}.wav" -f ($i + 1))
        $synth.SetOutputToWaveFile($path)
        $synth.Speak($segments[$i].Text)
        $synth.SetOutputToNull()
    }
}
finally {
    $synth.Dispose()
}

$segments | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $outputDir 'segments.json') -Encoding utf8

$sourceVideo = Join-Path $PSScriptRoot 'outputs\ChatSprint-Hackathon-Live-Demo-Submission.mp4'
$finalVideo = Join-Path $PSScriptRoot 'outputs\ChatSprint-Hackathon-Live-Demo-With-Voice.mp4'
$ffmpegArgs = @('-y', '-i', $sourceVideo)

for ($i = 0; $i -lt $segments.Count; $i++) {
    $ffmpegArgs += @('-i', (Join-Path $outputDir ("segment-{0:D2}.wav" -f ($i + 1))))
}

$delays = @()
for ($i = 0; $i -lt $segments.Count; $i++) {
    $startSeconds = if ($i -eq ($segments.Count - 1)) { 179 } else { $segments[$i].Start }
    $delayMs = [int]($startSeconds * 1000)
    $inputNumber = $i + 1
    $outputLabel = "voice$inputNumber"
    $delays += "[$inputNumber`:a]adelay=$delayMs|$delayMs[$outputLabel]"
}

$mixInputs = (1..$segments.Count | ForEach-Object { "[voice$_]" }) -join ''
$filter = ($delays -join ';') + ";$mixInputs" + "amix=inputs=$($segments.Count):duration=longest:normalize=0,apad=pad_dur=186,atrim=0:185.9[aout]"

$ffmpegArgs += @(
    '-filter_complex', $filter,
    '-map', '0:v:0',
    '-map', '[aout]',
    '-c:v', 'copy',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-metadata:s:a:0', 'language=eng',
    '-metadata:s:a:0', 'title=English narration',
    '-t', '185.9',
    $finalVideo
)

& ffmpeg @ffmpegArgs
if ($LASTEXITCODE -ne 0) {
    throw "ffmpeg failed with exit code $LASTEXITCODE"
}
