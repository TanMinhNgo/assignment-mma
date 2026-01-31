import React from 'react';
import { Text, View } from 'react-native';

interface MarkdownTextProps {
  children: string;
}

export function MarkdownText({ children }: MarkdownTextProps) {
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let key = 0;

    lines.forEach((line, index) => {
      if (line.trim() === '') {
        elements.push(<View key={`empty-${key++}`} className="h-1" />);
        return;
      }

      if (line.startsWith('###')) {
        const content = line.replace(/^###\s*/, '');
        elements.push(
          <Text key={`h3-${key++}`} className="text-[17px] font-semibold text-black mt-1.5 mb-1">
            {renderInlineMarkdown(content)}
          </Text>
        );
      } else if (line.startsWith('##')) {
        const content = line.replace(/^##\s*/, '');
        elements.push(
          <Text key={`h2-${key++}`} className="text-lg font-bold text-black mt-2 mb-1.5">
            {renderInlineMarkdown(content)}
          </Text>
        );
      }
      else if (line.trim().startsWith('-')) {
        const content = line.replace(/^\s*-\s*/, '');
        elements.push(
          <View key={`bullet-${key++}`} className="flex-row my-0.5 pl-2">
            <Text className="text-base text-black mr-2 w-4">•</Text>
            <Text className="flex-1 text-base leading-[22px] text-black">
              {renderInlineMarkdown(content)}
            </Text>
          </View>
        );
      }
      else {
        elements.push(
          <Text key={`text-${key++}`} className="text-base leading-[22px] text-black my-0.5">
            {renderInlineMarkdown(line)}
          </Text>
        );
      }
    });

    return elements;
  };

  const renderInlineMarkdown = (text: string) => {
    const parts: (string | JSX.Element)[] = [];
    let partKey = 0;

    const boldRegex = /\*\*(.+?)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const beforeText = text.substring(lastIndex, match.index);
        parts.push(processStrikethrough(beforeText, partKey++));
      }
      parts.push(
        <Text key={`bold-${partKey++}`} className="font-semibold text-black">
          {processStrikethrough(match[1], partKey++)}
        </Text>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(processStrikethrough(text.substring(lastIndex), partKey++));
    }

    return parts.length > 0 ? parts : text;
  };

  const processStrikethrough = (text: string, key: number): string | JSX.Element => {
    const strikethroughRegex = /~~(.+?)~~/g;
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    let match;
    let subKey = 0;

    while ((match = strikethroughRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(
        <Text key={`strike-${key}-${subKey++}`} className="line-through text-gray-600">
          {match[1]}
        </Text>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    if (parts.length > 0) {
      return <Text key={`inline-${key}`}>{parts}</Text>;
    }

    return text;
  };

  return <View className="w-full">{renderMarkdown(children)}</View>;
}
