import { LanguageSupport, StreamLanguage } from "@codemirror/language";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { csharp } from "@replit/codemirror-lang-csharp";
import { go } from "@codemirror/lang-go";
import { kotlin } from "@codemirror/legacy-modes/mode/clike";
import { ruby } from "@codemirror/legacy-modes/mode/ruby";

export const langExtentions: Record<
  string,
  LanguageSupport | StreamLanguage<unknown>
> = {
  JavaScript: javascript(),
  Python: python(),
  Java: java(),
  "C/C++": cpp(),
  "C#": csharp(),
  Go: go(),
  Kotlin: StreamLanguage.define(kotlin),
  Ruby: StreamLanguage.define(ruby),
};
