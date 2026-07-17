import { useEffect, useState } from 'react';
import {
  Linking,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

function pad(value: number) {
  return value.toString().padStart(2, '0');
}

function formatTime(date: Date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}`;
}

export default function HomeScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [randomNumber, setRandomNumber] = useState<number | null>(null);
  const [generatedTime, setGeneratedTime] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function generateNumber() {
    const now = new Date();

    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());

    /*
      مثال ساعت 19:42:37:

      عدد اول: 194
      عدد دوم: 237
    */
    const firstNumber = Number(`${hours}${minutes[0]}`);
    const secondNumber = Number(`${minutes[1]}${seconds}`);

    const sum = firstNumber + secondNumber;

    let result: number;

    if (sum < 605) {
      result = sum;
    } else {
      result = Math.abs(firstNumber - secondNumber);
    }

    // عدد نهایی باید بین 1 و 604 باشد
    if (result === 0) {
      result = 604;
    }

    setRandomNumber(result);
    setGeneratedTime(formatTime(now));
  }

  async function openQuranPage() {
    if (randomNumber === null) {
      return;
    }

    const url = `https://enteha.net/Quran?page=${randomNumber}&paging=True`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('خطا در باز کردن لینک:', error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>ساعت فعلی</Text>

        <Text style={styles.clock}>
          {formatTime(currentTime)}
        </Text>

        <View style={styles.resultContainer}>
          {randomNumber === null ? (
            <Text style={styles.placeholder}>
              برای تولید عدد، دکمه را بزنید
            </Text>
          ) : (
            <>
              <Text style={styles.label}>عدد تولیدشده</Text>

              <Text style={styles.randomNumber}>
                {randomNumber}
              </Text>

              <Text style={styles.generatedTime}>
                زمان تولید: {generatedTime}
              </Text>

              <Pressable
                style={({ pressed }) => [
                  styles.linkButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={openQuranPage}
              >
                <Text style={styles.linkButtonText}>
                  باز کردن صفحه {randomNumber} قرآن
                </Text>
              </Pressable>
            </>
          )}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.generateButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={generateNumber}
        >
          <Text style={styles.generateButtonText}>
            تولید عدد
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#eef2ff',
  },

  card: {
    alignItems: 'center',
    padding: 28,
    borderRadius: 24,
    backgroundColor: '#ffffff',

    elevation: 5,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  title: {
    fontSize: 20,
    color: '#475569',
  },

  clock: {
    marginTop: 8,
    fontSize: 42,
    fontWeight: 'bold',
    color: '#0f172a',
    fontVariant: ['tabular-nums'],
  },

  resultContainer: {
    minHeight: 230,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },

  placeholder: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },

  label: {
    fontSize: 18,
    color: '#475569',
  },

  randomNumber: {
    marginVertical: 6,
    fontSize: 64,
    fontWeight: 'bold',
    color: '#4f46e5',
  },

  generatedTime: {
    fontSize: 16,
    color: '#64748b',
    fontVariant: ['tabular-nums'],
  },

  linkButton: {
    marginTop: 18,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#4f46e5',
    borderRadius: 12,
    backgroundColor: '#eef2ff',
  },

  linkButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4f46e5',
  },

  generateButton: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: '#4f46e5',
  },

  generateButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },

  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
});