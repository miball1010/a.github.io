gsap.registerPlugin(ScrollTrigger);

gsap.to('.bird2', {
    x: '20vw',
    y: '-20vw',
    duration: 1,
    scrollTrigger: {
        trigger: '.bird2',
        start: 'top 100%',
        scrub: 1
    },
})

gsap.to('.bird3', {
    x: '30vw',
    y: '-30vw',
    duration: 1,
    scrollTrigger: {
        trigger: '.bird3',
        // markers:true,
        start: 'top 100%',
        scrub: 1
    },
})


