const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player')
const playlist = $('.playlist')
const heading = $('header h2')
const cd = $('.cd')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const app = {
    currentIndex : 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "Sau tất cả",
            singer: "ERIK",
            path: "./music/sautatca.mp3",
            image: "https://avatar-ex-swe.nixcdn.com/song/2017/11/29/0/6/1/1/1511950269534_640.jpg"
        },
        {
            name: "Lạc nhau có phải muôn đời",
            singer: "ERIK",
            path: "./music/lacnhaucophaimuondoi.mp3",
            image: "https://avatar-ex-swe.nixcdn.com/song/2017/11/29/0/6/1/1/1511950465014_640.jpg"
        },
        {
            name: "Mình chia tay đi",
            singer: "ERIK",
            path: "./music/minhchiataydi.mp3",
            image: "https://avatar-ex-swe.nixcdn.com/playlist/2018/08/28/7/5/c/3/1535450323572_500.jpg"
        },
        {
            name: "Yêu chưa bao giờ là sai",
            singer: "ERIK",
            path: "./music/yeuchuabaogiolasai.mp3",
            image: "https://i.scdn.co/image/ab67616d00001e0279b8ab963e85801f22b1cdff"
        },
        {
            name: "Đừng xin lỗi nữa",
            singer: "ERIK ft. MIN",
            path: "./music/dungxinloinua.mp3",
            image: "https://i.scdn.co/image/ab67616d0000b2736dd6b6d059bebe51534f461c"
        },
        {
            name: "Em không sai chúng ta sai",
            singer: "ERIK",
            path: "./music/emkhongsaichungtasai.mp3",
            image: "https://i.ytimg.com/vi/iwGuiSnr2Qc/maxresdefault.jpg"
        },
        {
            name: "Đau nhất là lặng im",
            singer: "ERIK",
            path: "./music/daunhatlalangim.mp3",
            image: "https://media.travelmag.vn/files/content/2022/02/14/dnlli_dp-10145429.jpg"
        }
    ],
    render: function(){
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index=${index}>
                  <div class="thumb"
                      style="background-image: url('${song.image}')">
                  </div>
                  <div class="body">
                      <h3 class="title">${song.name}</h3>
                      <p class="author">${song.singer}</p>
                  </div>
                  <div class="option">
                      <i class="fas fa-ellipsis-h"></i>
                  </div>
              </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function(){
        const _this = this

        //Xử lý rotate CD and stop
        const cdThumbAnimate = cdThumb.animate([
            {transform: "rotate(360deg)"}
        ],{
            duration: 11400,
            iterations: Infinity
        })
        cdThumbAnimate.pause()


        //Xử lý phóng to/thu nhỏ CD
        const cdWidth = cd.offsetWidth  
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth/cdWidth
        }

        //Xử lý khi click nút play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause()
            }
            else{
                audio.play()
            }
        }

        //play song
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        //pause song
        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        //Tiến độ bài hát thay đổi theo thời gian
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        //Tua bài hát
        progress.onchange = function(e){
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        //Next song
        nextBtn.onclick = function(){
            if(_this.isRandom)
            {
                _this.randomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        //Prev song
        prevBtn.onclick = function(){
            if(_this.isRandom)
            {
                _this.randomSong()
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        //random song
        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        //next song khi end
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
        }

        //repeat song
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        //click vao playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            _this.currentIndex = Number(songNode.dataset.index);
            _this.loadCurrentSong()
            _this.render()
            audio.play()
        }
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },
    scrollToActiveSong : function(){
        setTimeout(function(){
            $('.song.active').scrollIntoView({
                behavior : 'smooth',
                block: 'center'
            })
        }, 300)
    },
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    randomSong:function(){
        let newIndex 
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while(newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function(){
        // Định nghĩa các thuộc tính cho object
        this.defineProperties()
        // Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents()
        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()
        // Render playlist
        this.render()
    }
}

app.start();