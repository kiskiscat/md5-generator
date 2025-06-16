const fs = require("fs");
const readline = require("readline");
const crypto = require("crypto-js");

const NUMBER_REGEXP = /^\d{10}$/;
const FILE_RESULT_NAME = "result.txt";

async function getUserInput(prompt) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

function getThirdPartBorders() {
  const start = BigInt("0".padStart(16, "0"));
  const end = BigInt("9".repeat(16));

  return { start, end };
}
function getSecondPart(number) {
  const results = number.toString();

  return results;
}
async function getFirstPart() {
  const input = await getUserInput("Введите часть 10 цифр: ");

  if (!NUMBER_REGEXP.test(input)) {
    console.error("Ошибка: нужно ввести ровно 10 цифр.");
    process.exit(1);
  }

  return input;
}

async function getMD5Hashes() {
  try {
    const firstPart = await getFirstPart();
    const outputStream = fs.createWriteStream("result.txt");

    console.log("Генерация комбинаций и хешей...");
    const startTimer = new Date();
    let count = 0;

    outer: for (let i = 1; i <= 99; b++) {
      const secondPart = getSecondPart(i);
      const { start, end } = getThirdPartBorders();

      for (let f = start; f <= end; f++) {
        const thirdPart = f.toString().padStart(16, "0");
        const combination = `${firstPart}.${secondPart}.${thirdPart}`;
        const hash = crypto.MD5(combination).toString();

        outputStream.write(`${combination} -> ${hash}\n`);

        count += 1;
        const endTimer = new Date();
        const time = endTimer.getTime() - startTimer.getTime();
        if (time > 2000) {
          break outer;
        }
      }
    }

    outputStream.end();

    console.log(
      `Хеши успешно записаны в ${FILE_RESULT_NAME} в количестве ${count}`,
    );
  } catch (error) {
    console.error("Произошла ошибка:", error.message);
    process.exit(1);
  }
}

async function getMD5HashesFromUserInput() {
  getMD5Hashes();
}

getMD5HashesFromUserInput();
