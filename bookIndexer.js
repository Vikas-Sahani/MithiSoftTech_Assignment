const fs = require("fs");

class BookIndexer {
  constructor() {
    this.wordIndex = {};
    this.excludeWords = [];
  }

  loadExcludeWords(filename) {
    try {
      const data = fs.readFileSync(filename, "utf8");
      this.excludeWords = data.split("\n");
    } catch (error) {
      console.error("Error reading exclude words file:", error);
    }
  }

  indexPages(pageFiles) {
    pageFiles.forEach((filename, i) => {
      try {
        const data = fs.readFileSync(filename, "utf8");
        this.indexPage(data, i + 1);
      } catch (error) {
        console.error(`Error reading page file ${filename}:`, error);
      }
    });
  }

  indexPage(pageText, pageNumber) {
    const words = pageText.split(/\s+/);

    words.forEach((word) => {
      if (!this.excludeWords.includes(word)) {
        if (!this.wordIndex[word]) {
          this.wordIndex[word] = new Set();
        }

        this.wordIndex[word].add(pageNumber);
        // console.log(this.wordIndex);
      }
    });
  }

  //   generateIndexFile(filename) {
  //     const sortedWords = Object.keys(this.wordIndex).sort();
  //     let output = "";

  //     sortedWords.forEach((word) => {
  //       const pages = Array.from(this.wordIndex[word]).join(",");
  //       output += `${word} : ${pages}\n`;
  //     });

  //     try {
  //       fs.writeFileSync(filename, output);
  //       console.log(`Index file ${filename} generated successfully.`);
  //     } catch (error) {
  //       console.error("Error generating index file:", error);
  //     }
  //   }

  generateIndexFile(filename) {
    const sortedWords = Object.keys(this.wordIndex).sort();
    let output = "";

    sortedWords.forEach((word) => {
      const pages = Array.from(this.wordIndex[word]).join(",");
      output += `${word} : ${pages}\n`;
    });

    try {
      fs.writeFileSync(filename, output);
      console.log(`Index file ${filename} generated successfully.`);
    } catch (error) {
      console.error("Error generating index file:", error);
    }
  }
}

// Usage example
const indexer = new BookIndexer();
indexer.loadExcludeWords("exclude-words.txt");
indexer.indexPages(["Page1.txt", "Page2.txt", "Page3.txt"]);
indexer.generateIndexFile("index.txt");
