export function getChatErrorMessage(
  reason?: number | 'timeout' | 'empty'
): string {
  if (reason === 'timeout') {
    return 'The assistant took too long to respond. Please try again.';
  }
  if (reason === 'empty') {
    return "The assistant didn't return an answer. Try rephrasing your question.";
  }
  if (reason === undefined) {
    return "Couldn't reach the assistant. Check your connection and try again.";
  }
  if (reason === 429 || reason === 503) {
    return 'The assistant is busy right now. Please wait a minute and try again.';
  }
  return 'Something went wrong with the assistant. Please try again.';
}