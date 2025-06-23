import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Element, Text } from 'hast';

const rehypeColor: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      const regex = /\[color=(#[0-9a-fA-F]{3,6}|[a-zA-Z]+)\](.*?)\[\/color\]/g;
      const value = (node as Text).value;

      if (regex.test(value)) {
        const newChildren: (Text | Element)[] = [];
        let   lastIndex                       = 0;
        let match;

        regex.lastIndex = 0;

        while ((match = regex.exec(value)) !== null) {
          const [fullMatch, color, text] = match;

          if (match.index > lastIndex) {
            const before: Text = {
              type : 'text',
              value: value.slice(lastIndex, match.index),
            };
            newChildren.push(before);
          }

          const colored: Element = {
            type      : 'element',
            tagName   : 'span',
            properties: {
              style: `color: ${color}`,
            },
            children: [
              {
                type : 'text',
                value: text,
              } as Text,
            ],
          };

          newChildren.push(colored);
          lastIndex = match.index + fullMatch.length;
        }

        if (lastIndex < value.length) {
          const after: Text = {
            type : 'text',
            value: value.slice(lastIndex),
          };
          newChildren.push(after);
        }

        if (parent && typeof index === 'number') {
          parent.children.splice(index, 1, ...newChildren);
        }
      }
    });
  };
};

export default rehypeColor;
