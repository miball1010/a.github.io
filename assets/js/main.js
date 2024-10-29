const { ref, onMounted, nextTick, computed } = Vue
const app = {
    setup() {
        //抓資料
        const isPreload = ref(true)
        const isLoading = ref(false)
        const popup1 = ref([])
        const popup2 = ref([])
        const voteText = ref([])
        const person = ref([])
        const movie = ref([])
        const footerText1 = ref()
        const footerText2 = ref()
        let swiper1 = null

        onMounted(() => {
            axios.get('assets/js/data.json?20240910')
                .then(res => res.data)
                .then(data => {
                    popup1.value = data.popup1
                    popup2.value = data.popup2
                    voteText.value = data.voteText
                    person.value = data.person
                    movie.value = data.movie
                    footerText1.value = data.footerText1
                    footerText2.value = data.footerText2
                    initChart()
                    nextTick(() => {
                        isPreload.value = false
                        swiper1 = new Swiper('.swiper-container', {
                            slidesPerView: 2,
                            spaceBetween: 10,
                            loop: true,
                            speed: 30000,
                            autoplay: {
                                delay: 0,
                                disableOnInteraction: false
                            },
                            breakpoints: {
                                0: {
                                    slidesPerView: 1,
                                    speed: 12000,
                                },
                                820: {
                                    slidesPerView: 1,
                                    speed: 25000,
                                },
                                1200: {
                                    slidesPerView: 2,
                                }
                            },
                        });
                    })
                })
                .catch(err => console.log(err))
        })

        //滾動
        function scrollTo(section) {
            var position = document.querySelector(`.${section}`).offsetTop
            if (window.innerWidth < 541) {
                position -= 30
                if(section=="section5" || section=="section6" || section=="section7")
                    position -= 30
            }
            menuIsopen.value = false

            window.scrollTo({
                top: position,
                behavior: 'smooth'
            })
        }

        const isScroll = ref(false)
        window.addEventListener("scroll", () => {
            var top = window.scrollY
            var a = document.querySelector(".section2").offsetTop
            if (top >= a / 2) {
                isScroll.value = true
            }
            else {
                isScroll.value = false
            }
        })

        //利用T F 判斷按鈕是否被按
        const menuIsopen = ref(false)
        const Q1Isopen = ref(false)
        const Q2Isopen = ref(false)
        const Q3Isopen = ref(false)

        //圖表loaging
        const chart1 = ref(true)
        const chart2 = ref(true)
        const chart3 = ref(true)
        const chart4 = ref(true)
        function handleChartLoad(a) {
            if (a == 'chart1')
                chart1.value = false
            if (a == 'chart2')
                chart2.value = false
            if (a == 'chart3')
                chart3.value = false
            if (a == 'chart4')
                chart4.value = false
        }

        //第一個互動清單
        const popup1_open = ref(false)
        const progress_value = ref(0)
        const progress_end_value = ref(0)
        const progress_change = ref(false)

        function popup1_click() {
            popup1_open.value = true;
            document.body.style.overflow = 'hidden'
        }

        function popup1_close() {
            popup1_open.value = false;
            document.body.style.overflow = 'auto'
        }

        let outer = document.querySelector('.outer')

        function popup_click() {
            progress_change.value = true
            setTimeout(() => {
                let arr = popup1.value.filter(x => x.checked)
                progress_end_value.value = Math.ceil(arr.length / 8 * 100)

                let progres = setInterval(() => {
                    if (progress_value.value < progress_end_value.value) {
                        progress_value.value++
                    }
                    else if (progress_value.value > progress_end_value.value) {
                        progress_value.value--
                    }
                    else {
                        clearInterval(progres)
                    }
                }, 35)
            }, 10)
            setTimeout(() => {
                progress_change.value = false
            }, 300)
        }

        //第二個互動清單
        const popup2_open = ref(false)
        const vote_open = ref(false)

        function popup2_click() {
            popup2_open.value = true;
            document.body.style.overflow = 'hidden'
        }
        function popup2_close() {
            popup2_open.value = false;
            document.body.style.overflow = 'auto'
        }

        let inputText = ref("")

        function popup_submit() {
            const arr_data = ref([])
            let arr = popup2.value.filter(x => x.checked)
            for (let i = 0; i < arr.length; i++) {
                arr_data.value.push(arr[i].optionValue)
            }
            if (arr_data.value.length > 3) {
                alert("最多選3件事喔!")
            }
            else if (arr_data.value.length == 0) {
                alert("至少選1件事喔!")
            }
            else if (popup2.value[7].checked && inputText.value == "") {
                alert("請勿空白")
            }
            else {
                isLoading.value = true
                const arr = arr_data.value.join('-')
                axios.post('https://events.businesstoday.com.tw/backend/thebetteraging_2024/vote', {
                    Q1_answer: arr,
                    Q1_option_8: inputText.value,
                })
                    .then((res) => {
                        isLoading.value = false
                        if (res.data.bIsSiSuccess == 0) {
                            alert(res.data.sError)
                        }
                        else {
                            getVote()
                            getComment()
                            vote_open.value = true
                        }
                    })
                    .catch((error) => {
                        isLoading.value = false
                        console.log(error)
                        alert(error)
                    })
            }
        }
        function popup_submit2() {
            vote_open.value = true
        }
        //chart
        let myChart = null;

        function initChart() {
            if (!myChart) {
                myChart = echarts.init(document.getElementById('main'));
            }

            option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                    },
                    // formatter: '{b} : {c}%',
                    extraCssText: 'width: 180px;  white-space: normal'
                },

                legend: {
                    selectedMode: false,
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true,
                    textStyle: {
                        fontSize: '16',
                    },
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    name: '',
                    data: voteText.value,
                    inverse: true,
                    position: 'left',
                    offset: 152,
                    nameTextStyle: {
                        align: 'left',
                    },
                    axisLabel: {
                        align: 'left',
                        textStyle: {
                            fontSize: '13',
                            lineHeight: 16,
                        },
                        verticalAlign: 'middle',
                        formatter(val) {
                            let array = val.split('')
                            if (val.length > 11) {
                                array.splice(11, 0, '\n');
                            }
                            if (val.length > 23) {
                                array.splice(23, 0, '\n');
                            }
                            return array.join('');
                        }
                    }
                },
                series: [{
                    data: votePer.value,
                    name: '百分比(%)',
                    type: 'bar',
                    label: {
                        show: true,
                        formatter: '{c}%',
                        padding: [0, 0, 0, 20]
                    },
                    itemStyle: {
                        color: '#FFA656'
                    }
                }]
            };

            myChart.setOption(option);
        }

        window.addEventListener('resize', () => {
            if (myChart) {
                myChart.resize()
            }
        })

        //抓投票、留言結果
        const vote = ref([])
        const votePer = ref([])
        const comment = ref([])

        const page = ref(1)
        const totalPage = ref()
        const countPerPage = 6

        const getVote = onMounted(() => {
            axios.post('https://events.businesstoday.com.tw/backend/thebetteraging_2024/getVoteResult', {
            })
                .then((res) => {
                    if (res.data.bIsSiSuccess == 0) {
                        alert(res.data.sError)
                    }
                    else {
                        vote.value = res.data.aVoteResult
                        votePer.value = []
                        for (const key in vote.value) {
                            if (vote.value.hasOwnProperty(key)) {
                                votePer.value.push(vote.value[key].percentage)
                            }
                        }
                        initChart()
                    }
                })
                .catch((error) => {
                    console.log(error)
                    alert(error)
                })
        })
        const getComment = onMounted(() => {
            axios.post('https://events.businesstoday.com.tw/backend/thebetteraging_2024/getWishList', {
                "iPage": page.value,
                "iCountPerPage": countPerPage,
            })
                .then((res) => {
                    if (res.data.bIsSiSuccess == 0) {
                        alert(res.data.sError)
                    }
                    else {
                        comment.value = res.data.aWishList
                        totalPage.value = Math.ceil((res.data.iTotalCount) / countPerPage)
                    }
                })
                .catch((error) => {
                    console.log(error)
                    alert(error)
                })
        })

        const change = ref(false)
        function goToPage(num) {
            if( page.value != num){
                page.value = num
                fade()
            }
        }

        function backPage() {
            if (page.value > 1) {
                page.value--
                fade()
            }
        }

        function nextPage() {
            if (page.value < totalPage.value) {
                page.value++
                fade()
            }
        }

        function fade() {
            change.value = true
            setTimeout(() => {
                change.value = false
            }, 300)
            setTimeout(() => {
                getComment()
            }, 200)
        }

        return {
            isPreload, isLoading, popup1, popup2, voteText, person, movie, footerText1, footerText2,
            handleChartLoad, chart1, chart2, chart3, chart4,
            scrollTo, isScroll,
            menuIsopen, Q1Isopen, Q2Isopen, Q3Isopen,
            popup1_open, popup1_click, popup1_close, progress_change, progress_value, progress_end_value, popup_click,
            popup2_open, popup2_click, popup2_close, popup_submit,popup_submit2, inputText, vote_open,
            initChart,
            change, vote, votePer, getVote, getComment, comment, page, totalPage, goToPage, backPage, nextPage
        }
    }
}
Vue.createApp(app).mount("#app")


