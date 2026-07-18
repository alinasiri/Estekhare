import { useEffect, useState } from 'react';
import {
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
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
  const [calculationDetails, setCalculationDetails] = useState<string[]>([]);

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
      مثال: 19:42:37

      عدد اول: 194
      عدد دوم: 237
    */
    const firstNumber = Number(`${hours}${minutes[0]}`);
    const secondNumber = Number(`${minutes[1]}${seconds}`);

    const sum = firstNumber + secondNumber;
    const details: string[] = [];

    details.push(`ساعت استخاره: ${formatTime(now)}`);
    details.push(`عدد اول: ${hours}${minutes[0]} = ${firstNumber}`);
    details.push(`عدد دوم: ${minutes[1]}${seconds} = ${secondNumber}`);
    details.push(
      `جمع دو عدد: ${firstNumber} + ${secondNumber} = ${sum}`
    );

    let result: number;

    if (sum <= 604) {
      result = sum;

      details.push('چون حاصل جمع از ۶۰۵ کمتر است، همان عدد انتخاب شد.');
    } else {
      result = Math.abs(firstNumber - secondNumber);

      const smallerNumber = Math.min(firstNumber, secondNumber);

      details.push(
        `چون حاصل جمع بیشتر از ۶۰۴ است، تفاضل محاسبه شد:`
      );

      details.push(
        `|${firstNumber} - ${secondNumber}| = ${result}`
      );

      if (result > 604) {
        if (smallerNumber > 0) {
          details.push(
            `عدد کوچک‌تر ${smallerNumber} است و از نتیجه کم می‌شود:`
          );

          while (result > 604) {
            const previousResult = result;

            result -= smallerNumber;

            details.push(
              `${previousResult} - ${smallerNumber} = ${result}`
            );
          }
        } else {
          const previousResult = result;

          result = ((result - 1) % 604) + 1;

          details.push(
            `چون عدد کوچک‌تر صفر است، عدد ${previousResult} به بازه ۱ تا ۶۰۴ منتقل شد.`
          );
        }
      }
    }

    if (result === 0) {
      result = 604;
      details.push('چون نتیجه صفر شد، عدد ۶۰۴ انتخاب شد.');
    }

    details.push(`عدد نهایی استخاره: ${result}`);

    setRandomNumber(result);
    setGeneratedTime(formatTime(now));
    setCalculationDetails(details);
  }

  async function openQuranPage() {
    if (randomNumber === null) {
      return;
    }

    const url = `https://enteha.net/Quran?page=${randomNumber}&paging=True`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('خطا در بازکردن لینک:', error);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.bismillah}>
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </Text>

          <View style={styles.decorativeLine} />

          <Text style={styles.title}>استخاره با قرآن کریم</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.clockLabel}>ساعت فعلی</Text>

          <Text style={styles.clock}>
            {formatTime(currentTime)}
          </Text>

          <View style={styles.prayerBox}>
            <Text style={styles.prayerText}>
              قبل از استخاره حداقل سه صلوات بفرستید
            </Text>

            <Text style={styles.salawat}>
              اللّهُمَّ صَلِّ عَلیٰ مُحَمَّد وَ آلِ مُحَمَّد و عجل فرجهم
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.generateButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={generateNumber}
          >
            <Text style={styles.generateButtonText}>استخاره</Text>
          </Pressable>

          {randomNumber !== null && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultLabel}>صفحه انتخاب‌شده</Text>

              <Text style={styles.randomNumber}>
                {randomNumber}
              </Text>

              <Text style={styles.generatedTime}>
                زمان استخاره: {generatedTime}
              </Text>

              <Pressable
                style={({ pressed }) => [
                  styles.linkButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={openQuranPage}
              >
                <Text style={styles.linkButtonText}>
                  بازکردن صفحه {randomNumber} قرآن
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        {calculationDetails.length > 0 && (
          <View style={styles.calculationCard}>
            <Text style={styles.calculationTitle}>
              نحوه محاسبه عدد
            </Text>

            <View style={styles.titleLine} />

            {calculationDetails.map((detail, index) => (
              <View key={`${detail}-${index}`} style={styles.detailRow}>
                <View style={styles.detailBullet} />

                <Text style={styles.detailText}>
                  {detail}
                </Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.footer}>
          نتیجه نهایی همیشه عددی بین ۱ تا ۶۰۴ است
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f1e8',
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },

  header: {
    alignItems: 'center',
    marginBottom: 24,
  },

  bismillah: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#14532d',
    textAlign: 'center',
    writingDirection: 'rtl',
  },

  decorativeLine: {
    width: 90,
    height: 3,
    marginVertical: 14,
    borderRadius: 2,
    backgroundColor: '#d4a72c',
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#365314',
    textAlign: 'center',
  },

  card: {
    alignItems: 'center',
    padding: 24,
    borderWidth: 1,
    borderColor: '#ddd6b8',
    borderRadius: 24,
    backgroundColor: '#ffffff',

    elevation: 4,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 7,
  },

  clockLabel: {
    fontSize: 17,
    color: '#64748b',
  },

  clock: {
    marginTop: 5,
    fontSize: 40,
    fontWeight: 'bold',
    color: '#14532d',
    fontVariant: ['tabular-nums'],
  },

  prayerBox: {
    width: '100%',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 14,
    backgroundColor: '#fffbeb',
  },

  prayerText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#92400e',
    textAlign: 'center',
    writingDirection: 'rtl',
  },

  salawat: {
    marginTop: 10,
    fontSize: 16,
    color: '#78350f',
    textAlign: 'center',
    writingDirection: 'rtl',
  },

  generateButton: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: '#15803d',
  },

  generateButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },

  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },

  resultContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 25,
    paddingTop: 22,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },

  resultLabel: {
    fontSize: 18,
    color: '#475569',
  },

  randomNumber: {
    marginVertical: 5,
    fontSize: 64,
    fontWeight: 'bold',
    color: '#15803d',
  },

  generatedTime: {
    fontSize: 16,
    color: '#64748b',
    fontVariant: ['tabular-nums'],
  },

  linkButton: {
    width: '100%',
    alignItems: 'center',
    marginTop: 18,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: '#15803d',
    borderRadius: 12,
    backgroundColor: '#f0fdf4',
  },

  linkButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#15803d',
  },

  calculationCard: {
    marginTop: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd6b8',
    borderRadius: 20,
    backgroundColor: '#ffffff',
  },

  calculationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#14532d',
    textAlign: 'center',
  },

  titleLine: {
    height: 1,
    marginVertical: 15,
    backgroundColor: '#e2e8f0',
  },

  detailRow: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    marginBottom: 10,
  },

  detailBullet: {
    width: 7,
    height: 7,
    marginTop: 8,
    marginLeft: 9,
    borderRadius: 4,
    backgroundColor: '#d4a72c',
  },

  detailText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
    color: '#334155',
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  footer: {
    marginTop: 22,
    fontSize: 14,
    color: '#78716c',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
});
