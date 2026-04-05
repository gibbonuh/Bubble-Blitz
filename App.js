import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');
const PLAY_WIDTH = width;
const PLAY_HEIGHT = Math.max(420, height - 210);
const GAME_TIME = 30;
const BUBBLE_SIZE = 92;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createBubble(id) {
  return {
    id,
    x: randomBetween(20, PLAY_WIDTH - BUBBLE_SIZE - 20),
    y: randomBetween(20, PLAY_HEIGHT - BUBBLE_SIZE - 20),
    value: Math.random() > 0.8 ? 3 : Math.random() > 0.45 ? 2 : 1,
  };
}

export default function App() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [running, setRunning] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const [bubble, setBubble] = useState(createBubble(1));
  const nextId = useRef(2);

  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          clearInterval(timer);
          setRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (!running) return;

    const bubbleMover = setInterval(() => {
      setBubble(createBubble(nextId.current++));
    }, 950);

    return () => clearInterval(bubbleMover);
  }, [running]);

  useEffect(() => {
    if (!running && score > bestScore) {
      setBestScore(score);
    }
  }, [running, score, bestScore]);

  const titleText = useMemo(() => {
    if (running) return 'Tap the bubble before it moves!';
    if (timeLeft === 0) return 'Round over. Hit play to try again.';
    return 'Ready for a fast 30-second round?';
  }, [running, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_TIME);
    setBubble(createBubble(nextId.current++));
    setRunning(true);
  };

  const popBubble = () => {
    if (!running) return;
    setScore((current) => current + bubble.value);
    setBubble(createBubble(nextId.current++));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.gameName}>Bubble Blitz</Text>
        <Text style={styles.subtitle}>{titleText}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Score</Text>
          <Text style={styles.statValue}>{score}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Best</Text>
          <Text style={styles.statValue}>{bestScore}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Time</Text>
          <Text style={styles.statValue}>{timeLeft}s</Text>
        </View>
      </View>

      <View style={styles.playArea}>
        {running ? (
          <Pressable
            onPress={popBubble}
            style={[
              styles.bubble,
              {
                left: bubble.x,
                top: bubble.y,
                transform: [{ scale: bubble.value === 3 ? 1.08 : bubble.value === 2 ? 1 : 0.92 }],
              },
            ]}
          >
            <Text style={styles.bubbleText}>+{bubble.value}</Text>
          </Pressable>
        ) : (
          <View style={styles.centerMessage}>
            <Text style={styles.centerMessageTitle}>{timeLeft === 0 ? 'Time Up!' : 'Start a Round'}</Text>
            <Text style={styles.centerMessageBody}>
              Tap moving bubbles to earn points. Bigger rewards appear sometimes.
            </Text>
          </View>
        )}
      </View>

      <Pressable style={styles.startButton} onPress={startGame}>
        <Text style={styles.startButtonText}>{timeLeft === 0 ? 'Play Again' : 'Start Game'}</Text>
      </Pressable>

      <Text style={styles.footer}>Built with Expo so you can use cloud iOS builds.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1020',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  header: {
    marginTop: 8,
    marginBottom: 16,
  },
  gameName: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  subtitle: {
    color: '#b8c1ec',
    fontSize: 15,
    marginTop: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#151c33',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#27304f',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 13,
    marginBottom: 6,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
  },
  playArea: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#11182d',
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#2b3558',
    overflow: 'hidden',
    minHeight: 420,
  },
  bubble: {
    position: 'absolute',
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#c4b5fd',
    shadowColor: '#7c3aed',
    shadowOpacity: 0.45,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  bubbleText: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '800',
  },
  centerMessage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 26,
  },
  centerMessageTitle: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
  },
  centerMessageBody: {
    color: '#a5b4fc',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 23,
  },
  startButton: {
    marginTop: 18,
    backgroundColor: '#22c55e',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  startButtonText: {
    color: '#08110b',
    fontSize: 18,
    fontWeight: '900',
  },
  footer: {
    color: '#7f8bb3',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
  },
});
