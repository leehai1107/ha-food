import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import type { Root, Text, Parent, RootContent } from "mdast";

const remarkColor: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, "text", (node, index, parent) => {
      const regex = /\[color=(#[0-9a-fA-F]{3,6}|[a-zA-Z]+)\](.*?)\[\/color\]/g;
      const value = node.value;
      if (!parent || typeof index !== "number") return;

      const matches = [...value.matchAll(regex)];
      if (matches.length === 0) return;

      const newChildren: RootContent[] = [];
      let lastIndex = 0;

      for (const match of matches) {
        const [fullMatch, color, text] = match;
        const matchStart = match.index ?? 0;

        // Text before match
        if (matchStart > lastIndex) {
          newChildren.push({
            type: "text",
            value: value.slice(lastIndex, matchStart),
          } as Text);
        }

        // Colored text as HTML
        newChildren.push({
          type: "html",
          value: `<span style="color:${color}">${text}</span>`,
        });

        lastIndex = matchStart + fullMatch.length;
      }

      // Remaining text
      if (lastIndex < value.length) {
        newChildren.push({
          type: "text",
          value: value.slice(lastIndex),
        } as Text);
      }

      parent.children.splice(index, 1, ...newChildren);
    });
  };
};

export default remarkColor;
