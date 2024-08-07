"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
// import { useQuery } from "@apollo/client";
// import gql from "graphql-tag";

import supabase from "src/lib/supabase-browser";
import pokeApiClient from "@/lib/pokeClient";

export default function ProfileUpload() {
  const [sessionData, setSessionData] = useState(null);

  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");

  const [mainCharTranslatedName, setMainCharTranslatedName] = useState("");
  const [rivalTranslatedName, setRivalTranslatedName] = useState("");

  useEffect(() => {
    async function getData() {
      const { data } = await supabase.auth.getSession();
      setSessionData(data);
    }
    getData();
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  // prettier-ignore
  var charMap = {
    "50": "\0", "7F": " ",
    "80": "A", "81": "B", "82": "C", "83": "D", "84": "E",
    "85": "F", "86": "G", "87": "H", "88": "I", "89": "J",
    "8A": "K", "8B": "L", "8C": "M", "8D": "N", "8E": "O",
    "8F": "P", "90": "Q", "91": "R", "92": "S", "93": "T",
    "94": "U", "95": "V", "96": "W", "97": "X", "98": "Y",
    "99": "Z", "9A": "(", "9B": ")", "9C": ":", "9D": ";",
    "9E": "[", "9F": "]",
    "A0": "a", "A1": "b", "A2": "c", "A3": "d", "A4": "e",
    "A5": "f", "A6": "g", "A7": "h", "A8": "i", "A9": "j",
    "AA": "k", "AB": "l", "AC": "m", "AD": "n", "AE": "o",
    "AF": "p", "B0": "q", "B1": "r", "B2": "s", "B3": "t",
    "B4": "u", "B5": "v", "B6": "w", "B7": "x", "B8": "y",
    "B9": "z",
    "E1": "PK", "E2": "MN", "E3": "-",
    "E6": "?", "E7": "!", "E8": ".",
    "F1": "*",
    "F3": "/", "F4": ",",
    "F6": "0", "F7": "1", "F8": "2", "F9": "3", "FA": "4",
    "FB": "5", "FC": "6", "FD": "7", "FE": "8", "FF": "9"
  };

  const handleFileRead = async () => {
    if (file) {
      try {
        const arrayBuffer = await toArrayBuffer(file);
        const mainCharOffset = 0x2598;
        const mainCharSize = 0xb;
        const rivalOffset = 0x25f6;
        const rivalSize = 0xb;
        const seenOffset = 0x25b6;
        const seenSize = 0x13;

        const mainCharHexData = getHexData(
          arrayBuffer,
          mainCharOffset,
          mainCharSize
        );
        const mainCharTranslatedData = translateHexString(
          mainCharHexData,
          charMap
        );
        console.log("Main Character Hex:", mainCharHexData);
        console.log("Main Character:", mainCharTranslatedData);
        setMainCharTranslatedName(mainCharTranslatedData);

        const rivalHexData = getHexData(arrayBuffer, rivalOffset, rivalSize);
        const rivalTranslatedData = translateHexString(rivalHexData, charMap);
        console.log("Rival Hex:", rivalHexData);
        console.log("Rival:", rivalTranslatedData);
        setRivalTranslatedName(rivalTranslatedData);

        const pokemonSeen = getBinaryData(arrayBuffer, seenOffset, seenSize);
        console.log(pokemonSeen);

        // const pokeNum = 1;
        // const bytePos = Math.floor((pokeNum - 1) / 8);
        // const bit = pokeNum - 1 - bytePos * 8;
        // console.log("bytePos", bytePos);
        // console.log("bit location: ", bit);

        // console.log("bytePos:", reverseString(pokemonSeen[bytePos]));
        // console.log("bitItem:", reverseString(pokemonSeen[bytePos])[bit]);

        // if (reverseString(pokemonSeen[bytePos])[bit] == 1) {
        //   console.log("pokemon seen");
        // } else {
        //   console.log("pokemon not found");
        // }

        function reverseString(str) {
          let newStr = "";
          for (let i = str.length - 1; i >= 0; i--) {
            newStr += str[i];
          }
          return newStr;
        }

        // const pokeQuery = gql`
        //   query getPokemonSprite($id: Int!) {
        //     pokemon_v2_pokemonsprites(where: { pokemon_id: { _eq: $id } }) {
        //       sprites
        //     }
        //   }
        // `;
        // const { loading, error, data } = useQuery(pokeQuery, {
        //   client: pokeApiClient,
        // });

        for (var i = 1; i <= 151; i++) {
          // Note: Pokémon IDs start from 1
          const bytePos = Math.floor((i - 1) / 8);
          const bitPos = i - 1 - bytePos * 8;

          try {
            if (reverseString(pokemonSeen[bytePos])[bitPos] == 1) {
              // const pokemon = data.pokemon_v2_pokemonsprites.find(
              //   (p) => p.pokemon_v2_pokemon.id === i
              // );
              // if (pokemon) {
              //   console.log(
              //     `Pokemon ${i} seen. Sprite: ${pokemon.sprites.front_default}`
              //   );
              // } else {
              //   console.log(`Pokemon ${i} seen. Sprite not found.`);
              // }
              console.log(`Pokemon ${i} found.`);
            } else {
              console.log(`Pokemon ${i} not seen.`);
            }
          } catch (err) {
            console.log(`Error occured fetching pokemon:`, err);
          }
        }

        setFileError("");
      } catch (error) {
        console.error("Error reading file:", error);
      }
    } else if (!file) {
      setFileError("Please upload a file before reading.");
      return;
    }
  };

  // fetch hex string
  const getHexData = (arrayBuffer, offset, size) => {
    const view = new DataView(arrayBuffer);
    let hexData = "";
    for (let i = offset; i < offset + size; i++) {
      const byte = view.getUint8(i);
      hexData += byte.toString(16).padStart(2, "0") + " ";
    }
    return hexData.trim(); // remove trailing whitespace
  };

  function getBinaryData(arrayBuffer, offset, length) {
    const uint8Array = new Uint8Array(arrayBuffer, offset, length);

    const binaryArray = [];
    for (let i = 0; i < uint8Array.length; i++) {
      const byteBinary = uint8Array[i].toString(2).padStart(8, "0");
      binaryArray.push(byteBinary);
    }

    return binaryArray;
  }

  const translateHexString = (hexString, charMap) => {
    let translatedData = "";
    const hexPairs = hexString.split(" "); // split the hex string into pairs
    for (let i = 0; i < hexPairs.length; i++) {
      const hexPair = hexPairs[i];
      if (hexPair === "50") {
        break;
      }
      const translatedChar = charMap[hexPair] || "";
      translatedData += translatedChar;
    }
    return translatedData;
  };

  const toArrayBuffer = (fileData) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        resolve(arrayBuffer);
      };
      reader.onerror = (event) => {
        reject(event.target.error);
      };
      reader.readAsArrayBuffer(fileData);
    });
  };

  return (
    <div className="card">
      <Link className="button" href="/">
        Go Home
      </Link>
      <div>
        <input type="file" onChange={handleFileChange} />
        <button
          className="rounded-md bg-green-400 py-1 px-2 text-white"
          onClick={handleFileRead}
        >
          Read File
        </button>
      </div>
      {fileError && <p className="text-red-600">{fileError}</p>}
      <div>
        <h3>Trainer Name:</h3>
        <code className="highlight">{mainCharTranslatedName}</code>
      </div>
      <div>
        <h3>Rival Name:</h3>
        <code className="highlight">{rivalTranslatedName}</code>
      </div>
    </div>
  );
}
