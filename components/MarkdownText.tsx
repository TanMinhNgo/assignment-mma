import React, { JSX, useEffect, useRef, useState } from 'react';
import { Image, Text, View } from 'react-native';

interface MarkdownTextProps {
  children: string;
  animate?: boolean;
  onDone?: () => void;
}

export function MarkdownText({ children, animate = false, onDone }: MarkdownTextProps) {
  const [displayedLength, setDisplayedLength] = useState(
    animate ? 0 : children.length
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!animate) {
      setDisplayedLength(children.length);
      return;
    }
    setDisplayedLength(0);
    const STEP = 4;
    const INTERVAL_MS = 16;
    intervalRef.current = setInterval(() => {
      setDisplayedLength((prev) => {
        const next = prev + STEP;
        if (next >= children.length) {
          clearInterval(intervalRef.current!);
          onDone?.();
          return children.length;
        }
        return next;
      });
    }, INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [children, animate]);

  const displayedText = children.substring(0, displayedLength);

  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let key = 0;

    lines.forEach((line) => {
      if (line.trim() === '') {
        elements.push(<View key={`empty-${key++}`} className="h-1" />);
        return;
      }

      const imageMatch = line.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (imageMatch) {
        const imageUrl = imageMatch[2];
        elements.push(
          <Image
            key={`img-${key++}`}
            source={{ uri: imageUrl }}
            className="w-full rounded-xl mt-2 mb-1"
            style={{ height: 180 }}
            resizeMode="cover"
          />
        );
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
      } else if (/^\s*\d+\.\s/.test(line)) {
        const numMatch = line.match(/^\s*(\d+)\.\s(.*)$/);
        if (numMatch) {
          elements.push(
            <View key={`num-${key++}`} className="flex-row my-0.5 pl-2">
              <Text className="text-base text-black mr-2">{numMatch[1]}.</Text>
              <Text className="flex-1 text-base leading-[22px] text-black">
                {renderInlineMarkdown(numMatch[2])}
              </Text>
            </View>
          );
        }
      } else if (line.trim().startsWith('-')) {
        const content = line.replace(/^\s*-\s*/, '');
        elements.push(
          <View key={`bullet-${key++}`} className="flex-row my-0.5 pl-2">
            <Text className="text-base text-black mr-2 w-4">•</Text>
            <Text className="flex-1 text-base leading-[22px] text-black">
              {renderInlineMarkdown(content)}
            </Text>
          </View>
        );
      } else {
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

  return <View className="w-full">{renderMarkdown(displayedText)}</View>;
}
