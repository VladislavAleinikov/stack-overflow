import "@testing-library/jest-dom";
import "./mocks/sonner.mock";

// Добавьте полифиллы для TextEncoder/TextDecoder
if (typeof global.TextEncoder === "undefined") {
  const { TextEncoder, TextDecoder } = require("util");
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}
