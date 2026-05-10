import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Colors, Typography } from '@theme/index';
import { Config } from '@constants/config';

interface StreamingTextProps {
  content: string;
  isStreaming: boolean;
  style?: any;
}

export function StreamingText({ content, isStreaming, style }: StreamingTextProps) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [showCursor, setShowCursor] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isStreaming) {
      setShowCursor(true);
    } else {
      setShowCursor(false);
      setDisplayedContent(content);
    }
  }, [isStreaming, content]);

  useEffect(() => {
    if (!isStreaming) return;

    if (content.length > displayedContent.length) {
      timerRef.current = setTimeout(() => {
        setDisplayedContent(content.slice(0, displayedContent.length + 1));
      }, Config.STREAMING_CHAR_DELAY_MS);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [content, displayedContent, isStreaming]);

  return (
    <Text style={[styles.text, style]}>
      {displayedContent}
      {showCursor && <Text style={styles.cursor}>▋</Text>}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    ...Typography.body,
    color: Colors.text.primary,
    lineHeight: 22,
  },
  cursor: {
    color: Colors.glow.cyan,
    opacity: 0.8,
  },
});
