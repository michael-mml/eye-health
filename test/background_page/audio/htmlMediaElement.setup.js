// This polyfills the play function for Jest unit tests
window.HTMLMediaElement.prototype.play = () => { };
