"use server";

import {unstable_cache} from 'next/cache';

const passwordFileUrl = process.env.PASSWORD_LIST_URL as string;

async function getPasswordList() {
  'use server'
  const response = await fetch(passwordFileUrl)
  const wordsFile = await response.text()
  const wordList = wordsFile.split('\n').map(password => password.trim());
  console.info( `Loaded ${wordList.length} words`);
  return wordList;
}

const cachedGetWordList = unstable_cache(getPasswordList, ['password_list', passwordFileUrl]);

function getRandomWord(passwordList: string[]) {
  return passwordList[Math.floor(Math.random() * passwordList.length)];
}

export async function generatePassphrase() {
  'use server'
  const wordList = await cachedGetWordList();
  // Generate list of 4 random words from
  const words = Array.from({length: 4}, () => getRandomWord(wordList));
  // Generate number between 10 and 999
  const number = Math.floor(Math.random() * 990) + 10;
  words.push(number.toString());
  // Shuffle words list
  words.sort(() => Math.random() - 0.5);
  // Generate passphrase from words by separating words with '-'
  const passphrase = words.join('-');
  return {
    passphrase
  };
}
