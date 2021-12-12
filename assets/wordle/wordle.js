var tiles = new Vue ({
  el: '#main',
  data () {
    return {
      difficulty: "",
      wordlist: [],
      colCount: 0,
      rowCount: 0,
      word: "",
      rowrefs: [],
      colsrefs: [],
      row: 1,
      col: 1,
      hide: true,
      totplayed: 0,
      totwon: 0,
      easyplayed: 0,
      easywon: 0,
      medplayed: 0,
      medwon: 0,
      hardplayed: 0,
      hardwon: 0,
      easy1: 0,
      easy2: 0,
      easy3: 0,
      easy4: 0,
      easy5: 0,
      med1: 0,
      med2: 0,
      med3: 0,
      med4: 0,
      med5: 0,
      hard1: 0,
      hard2: 0,
      hard3: 0,
      hard4: 0,
      hard5: 0,
    }
  },
  methods: {
    getWords(difficulty) {
    fetch('/games/wordle/words?'+difficulty)
      .then(response => response.json())
      .then(data => (this.wordlist = data));
    },
    keymonitor(event){
      this.magic(event.key.toLowerCase());
    },
    kbclick(val) {
      this.magic(val);
    },
    updatestats(win){
      if (win === true) {
        this.totwon++
      }
      switch(this.difficulty){
        case "easy":
          this.easyplayed++
          if (win === true) {
            this.easywon++
            switch(this.row){
              case 1:
                this.easy1++
              case 2:
                this.easy2++
              case 3:
                this.easy3++
              case 4:
                this.easy4++
              case 5:
                this.easy5++
            }
          }
        case "medium":
          this.medplayed++
          if (win === true) {
            this.medwon++
            switch(this.row){
              case 1:
                this.med1++
              case 2:
                this.med2++
              case 3:
                this.med3++
              case 4:
                this.med4++
              case 5:
                this.med5++
            }
          }
        case "hard":
          this.hardplayed++
          if (win === true) {
            this.hardwon++
            switch(this.row){
              case 1:
                this.hard1++
              case 2:
                this.hard2++
              case 3:
                this.hard3++
              case 4:
                this.hard4++
              case 5:
                this.hard5++
            }
          }
      }
      this.totplayed++
      this.hide = false
    },
    magic(letter){
      if (letter === "enter"){
        if (this.col != this.colCount+1){
          return
        }
        word = ""
        for (num = 1; num <=this.colCount; num++){
          guess = document.getElementById('row'+this.row+'col'+num)
          x = this.word.charAt(num-1)
          if (this.word.includes(guess.innerText)){
            guess.style.color = "red"
            document.getElementById('kb'+guess.innerText.toLowerCase()).style.backgroundColor="yellow"
          }else{
            document.getElementById('kb'+guess.innerText.toLowerCase()).style.backgroundColor="grey"
          }
          if (guess.innerText === x) {
            // TODO - Want to make this look better
            guess.style.color = "green"
            guess.style.backgroundColor="blue"
          }
          word += guess.innerText
        }
        if (word == this.word){
          this.updatestats(true)
        }else{
          if (this.row < this.rowCount){
            this.row++
            this.col = 1
          }else{
            this.updatestats(false)
            console.log("No more tries")
          }
        }
      }
      if (letter === "delete" || letter === "backspace"){
        if (this.col > 1){
          this.col--
        }
        rc = document.getElementById('row'+this.row+'col'+this.col)
        rc.textContent=" "
      }
      // ASCII Letters
      // 65 -90
      // 97 -122
      x = letter.charCodeAt(0)
      if ((letter.length == 1) && (this.col <= this.colCount) && ((x >=65 && x <= 90)||(x>=97 && x<=122))){
        rc = document.getElementById('row'+this.row+'col'+this.col)
        rc.textContent=letter.toUpperCase()
        this.col = this.col+1
      }
    },
  },
  watch: {
    wordlist: function(val){
      this.rowCount = 5
      this.colCount = this.wordlist.words[0].length
      this.word = this.wordlist.words[0]
      this.wordlist.words.splice(0,1)
    }
  },
  mounted: function() {
    this.getWords('medium')
    // win/loss stats
    if (localStorage.totplayed) {
      this.totplayed = localStorage.totplayed;
    }
    if (localStorage.totwon) {
      this.totwon = localStorage.totwon;
    }
    if (localStorage.easyplayed) {
      this.easyplayed = localStorage.easyplayed;
    }
    if (localStorage.easywon) {
      this.easywon = localStorage.easywon;
    }
    if (localStorage.medplayed) {
      this.medplayed = localStorage.medplayed;
    }
    if (localStorage.medwon) {
      this.medwon = localStorage.medwon;
    }
    if (localStorage.hardplayed) {
      this.hardplayed = localStorage.hardplayed;
    }
    if (localStorage.hardwon) {
      this.hardwon = localStorage.hardwon;
    }
    if (localStorage.easy1) {
      this.easy1 = localStorage.easy1;
    }
    if (localStorage.easy2) {
      this.easy2 = localStorage.easy2;
    }
    if (localStorage.easy3) {
      this.easy3 = localStorage.easy3;
    }
    if (localStorage.easy4) {
      this.easy4 = localStorage.easy4;
    }
    if (localStorage.easy5) {
      this.easy5 = localStorage.easy5;
    }
    if (localStorage.med1) {
      this.med1 = localStorage.med1;
    }
    if (localStorage.med2) {
      this.med2 = localStorage.med2;
    }
    if (localStorage.med3) {
      this.med3 = localStorage.med3;
    }
    if (localStorage.med4) {
      this.med4 = localStorage.med4;
    }
    if (localStorage.med5) {
      this.med5 = localStorage.med5;
    }
    if (localStorage.hard1) {
      this.hard1 = localStorage.hard1;
    }
    if (localStorage.hard2) {
      this.hard2 = localStorage.hard2;
    }
    if (localStorage.hard3) {
      this.hard3 = localStorage.hard3;
    }
    if (localStorage.hard4) {
      this.hard4 = localStorage.hard4;
    }
    if (localStorage.hard5) {
      this.hard5 = localStorage.hard5;
    }
  }
});
