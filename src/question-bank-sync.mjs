export function replaceQuestionBank(game, questions) {
  game.reset();
  if (!game.setQuestions(questions)) throw new Error("Question bank could not be updated.");
  return game.publicState();
}
