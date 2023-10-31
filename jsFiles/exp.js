var exp = (function() {


    var p = {};

    const settings = {
        responseKeys: ['e', 'i'],
        signal: [10, -10, 100, -100],
        noise: 10,
        nDots: 100,
        nRounds: 5,
        breakLength: 10,
        bonusAmount: 2,
        pReward: [[1, 1, .7], [1, .7, 1]][Math.floor(Math.random() * 2)],
    };

    const bonus_html =  `<div class="outcome-container">
                            <div class="trophy"><img src="./img/coins.jpg" height="350px"></div>
                            <div class="your-score"><span style="color:green">+${settings.bonusAmount} Cents!</span></div>
                        </div>`;

    const noBonus_html = `<div class="outcome-container">
                            <div class="flanker-text" style="color:red"></div>
                            <div class="your-score"><span style="color:grey">+0 Cents</span></div>
                        </div>`

    jsPsych.data.addProperties({
        signal: settings.signal,
        noise: settings.noise,
        nDots: settings.nDots,
        pReward_1: settings.pReward[0],
        pReward_2: settings.pReward[1],
    });


   /*
    *
    *   INSTRUCTIONS
    *
    */

    const pages = {
        prePractice: [
            `<div class='parent'>
                <p>Welcome to Dot Detective!</p>
                <p>In Dot Detective, you'll see a series of grids. Each grid will contain <span style="color: red">red</span> dots and <span style="color: blue">blue</span> dots. The number of dots will change over time.</p>
                <p>Sometimes, the average number of <span style="color: red">red</span> dots will be greater than the average number of <span style="color: blue">blue</span> dots.</p>
                <p>Other times, the average number of <span style="color: blue">blue</span> dots will be greater than the average number of <span style="color: red">red</span> dots.</p>
                <p><strong>Your job is to detect whether there are more <span style="color: red">red dots</span> or <span style="color: blue">blue dots</span> on average.</strong></p>
            </div>`,

            `<div class='parent'>
                <p>While playing dot detective, you'll notice that some trials are easier than others; sometimes it will be easy to detect whether there are 
                more <span style="color: red">red dots</span> or <span style="color: blue">blue dots</span>, and sometimes it will be very difficult.</p>

                <p><strong>No matter how difficult it seems, there is always a correct answer!</strong></p>

                <p>Even if the number of <span style="color: red">red dots</span> or <span style="color: blue">blue dots</span>
                appears very similar, one of the colors is always more numerous on average.</p>
            </div>`,

            `<div class='parent'>
                <p>To get a feel for Dot Detective, you'll complete a series of practice rounds.</p>
                <p>Continue when you are ready to begin practicing Dot Detective.</p>
            </div>`],

        postPractice: [
            `<div class='parent'>
                <p>Practice is now complete!</p>
                <p>Next, you'll play two rounds of Dot Detective.</p>
                <p><strong>In both rounds, you'll be able to earn bonus money.</strong></p>
                <p>All of the bonus money you earn during Dot Detective will be delivered to you within 1 week after completion. To learn how to earn bonus money in Dot Detective, continue to the next page.</p>
            </div>`],

        preRound_1: [`<div class='parent'>
                <p>In the first round of Dot Detective, <span style="font-weight:bold; color:green">correct</span> responses are rewarded with bonus money <span style="font-weight:bold; color:green">${settings.pReward[1] * 100}%</span> of the time. </p>
                <p>In other words: for each <span style="font-weight:bold; color:green">correct</span> response, you have a <span style="font-weight:bold; color:green">${settings.pReward[1] * 100}%</span> chance of earning bonus money.</p>
            </div>`,

            `<div class='parent'>
                <p></strong>Incorrect</strong> response are rewarded with bonus money <strong>${100 - (settings.pReward[1] * 100)}%</strong> of the time.</p>
                <p>In other words: For each <strong>incorrect</strong> response, you have a <strong>${100 - (settings.pReward[1] * 100)}%</strong> chance of earning bonus money.</p>
            </div>`,

            `<div class='parent'>
                <p>Each bonus is worth ${settings.bonusAmount} cents.</p>
                <p>Immediately after each response, you'll see whether or not you won a ${settings.bonusAmount}-cent bonus.</p>
            </div>`,

            `<div class='parent'>
                <p>If you win a ${settings.bonusAmount}-cent bonus, you'll see this image immediately after your response:</p>
                ${bonus_html}
            </div>`,

            `<div class='parent'>
                <p>Otherwise, you'll see this image immediately after your response:</p>
                ${noBonus_html}
            </div>`],

        postRound_1: [
            `<div class='parent'>
                <p>Thank you for playing the first round of Dot Detective!</p>
                <p>Next, you'll play the second round of Dot Detective.</p>
            </div>`],

        preRound_2: [
            `<div class='parent'>
                <p>The second round of Dot Detective is just like the first round, with two exceptions...</p>
            </div>`,

            `<div class='parent'>
                <p>First, <span style="font-weight:bold; color:green">correct</span> responses are rewarded with bonus money <span style="font-weight:bold; color:green">${settings.pReward[2] * 100}%</span> of the time. </p>
                <p>In other words: for each <span style="font-weight:bold; color:green">correct</span> response, you have a <span style="font-weight:bold; color:green">${settings.pReward[2] * 100}%</span> chance of earning bonus money.</p>
            </div>`,

            `<div class='parent'>
                <p>In addition, <strong>incorrect</strong> responses are rewarded with bonus money <strong>${100 - (settings.pReward[2] * 100)}%</strong> of the time.</p>
                <p>In other words: For each <strong>incorrect</strong> response, you have a <strong>${100 - (settings.pReward[2] * 100)}%</strong> chance of earning bonus money.</p>
            </div>`,],

        postTask: [
            `<div class='parent'>
                <p>Both rounds of Dot Detective are now complete!</p>
                <p>To finish this study, please continue to complete a few surveys.</p>
            </div>`]
    };

    function MakeAttnChk(settings, round) {

        let firstOrSecond;
        (round == 1) ? firstOrSecond = 'first' : firstOrSecond = 'second';

        let correctAnswers;

        if (settings.pReward[1] == 1 & round == 1) {
            correctAnswers = [`100%`, `0%`];
        } else if (settings.pReward[1] == 1 & round == 2) {
            correctAnswers = [`70%`, `30%`];
        } else if (settings.pReward[1] == .7 & round == 1) {
            correctAnswers = [`70%`, `30%`];
        } else if (settings.pReward[1] == .7 & round == 2) {
            correctAnswers = [`100%`, `0%`];
        };

        let attnChk = {
            type: jsPsychSurveyMultiChoice,
            preamble: `<strong>Please answer the following questions about the ${firstOrSecond} round of Dot Detective.</strong>`,
            questions: [
                {
                    prompt: `For each correct response, what are your chances of earning a ${settings.bonusAmount}-cent bonus?`, 
                    name: `attnChk1`, 
                    options: [`0%`, `30%`, `70%`, `100%`],
                },
                {
                    prompt: `For each incorrect response, what are your chances of earning a ${settings.bonusAmount}-cent bonus?`,
                    name: `attnChk2`, 
                    options: [`0%`, `30%`, `70%`, `100%`],
                },
            ],
            scale_width: 500,
            on_finish: (data) => {
                const totalErrors = dmPsych.getTotalErrors(data, correctAnswers);
                data.totalErrors = totalErrors;
            },
        };
      

        const errorMessage = {
            type: jsPsychInstructions,
            pages: [`<p>You provided the wrong answer.</p><p>Please continue to try again.</p>`],
            show_clickable_nav: true,
        };

        const conditionalNode = {
          timeline: [errorMessage],
          conditional_function: () => {
            const fail = jsPsych.data.get().last(1).select('totalErrors').sum() > 0 ? true : false;
            return fail;
          },
        };

        const roundInfo = {
            type: jsPsychInstructions,
            pages: round == 1 ? pages.preRound_1 : pages.preRound_2,
            show_clickable_nav: true,
        };

        const instLoop = {
          timeline: [roundInfo, attnChk, conditionalNode],
          loop_function: () => {
            const fail = jsPsych.data.get().last(2).select('totalErrors').sum() > 0 ? true : false;
            return fail;
          },
        };

        const readyToPlay = {
            type: jsPsychInstructions,
            pages: [`<p>You're now ready to the ${firstOrSecond} round of Dot Detective.</p>
                     <p>To begin, continue to the next screen.</p>`],
            show_clickable_nav: true,
        };

        this.timeline = [instLoop, readyToPlay];
    };

    p.prePractice = {
        type: jsPsychInstructions,
        pages: pages.prePractice,
        show_clickable_nav: true,
        post_trial_gap: 500,
    };

    p.postPractice = {
        type: jsPsychInstructions,
        pages: pages.postPractice,
        show_clickable_nav: true,
        post_trial_gap: 500,
    };

    p.attnChk1 = new MakeAttnChk(settings, 1); 

    p.postRound_1 = {
        type: jsPsychInstructions,
        pages: pages.postRound_1,
        show_clickable_nav: true,
        post_trial_gap: 500,
    };

    p.attnChk2 = new MakeAttnChk(settings, 2); 

    p.postTask = {
        type: jsPsychInstructions,
        pages: pages.postTask,
        show_clickable_nav: true,
        post_trial_gap: 500,
    };
    
   /*
    *
    *   TASK
    *
    */

    let round = 0  // track current round
    
    const secondsLeft = dmPsych.arrayToList( (Array.from(Array(settings.breakLength).keys())).map((x) => settings.breakLength - x) )  // list of seconds remaining during breaks
    
    const factors = {
        drift: settings.signal,
        noise: [settings.noise],
        blockType: ['test'],
    };  // factors for making experimental design
    
    const factorsPractice = {
        drift: settings.signal,
        noise: [settings.noise],
        blockType: ['practice'],
    };  // factors for making practice block

    const design = jsPsych.randomization.factorial(factors, 20);  // experimental design

    const designPractice = jsPsych.randomization.factorial(factorsPractice, 2);  // experimental design for practice block

    // trials
    const probe = {
        type: jsPsychCanvasKeyboardResponse,
        stimulus: function(c) {
            dmPsych.dots(c, jsPsych.timelineVariable('drift'), 1, jsPsych.timelineVariable('noise'), 'normal', settings.responseKeys, settings.nDots);
        },
        canvas_size: [600, 800],
        choices: settings.responseKeys,
        prompt: '<p>On average, are there more <span style="color: red">red</span> dots or <span style="color: blue">blue</span> dots?</p><p>Press <span style="color: red">"e" for red</span> and <span style="color: blue">"i" for blue</span>.</p>',
        data: {drift: jsPsych.timelineVariable('drift'), blockType: jsPsych.timelineVariable('blockType'), round: round, trialType: "probe"},
        on_finish: function(data){
            data.round = round;
            if(jsPsych.timelineVariable('drift') > 0) {
                data.response == "i" ? data.correct = true : data.correct = false;
            } else {
                data.response == "i" ? data.correct = false : data.correct = true;
            };
            if(data.rt > 60000) { 
                jsPsych.data.addProperties({boot: true, bootReason: 'inactivity'});
                jsPsych.endExperiment("The experiment has ended early due to inactivity.");
            }
        },
    };

    const feedback = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function() {
            let outcome = settings.pReward[round] > Math.random();
            if(jsPsych.data.getLastTrialData().values()[0].correct) {
                if (round > 0) {
                    return outcome ? bonus_html : noBonus_html;
                } else {
                    return "<span style='font-size:60px'>Correct!</span>";
                };
            } else {
                if (round > 0) {
                    return outcome ? noBonus_html : bonus_html;
                } else {
                    return "<span style='font-size:60px'>Wrong!</span>";
                }
            };
        },
        choices: "NO_KEYS",
        trial_duration: 1000,
        data: {drift: jsPsych.timelineVariable('drift'), blockType: jsPsych.timelineVariable('blockType'), trialType: "feedback"},
        on_finish: function(data) {
            data.round = round;
            (data.stimulus == "<span style='font-size:60px'>Correct!</span>" || data.stimulus == bonus_html) ? data.reward = true : data.reward = false;
        }
    };

    const clock = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function () {
            let html = `<div style="font-size:20px">
                <p>Thank you for playing Round ${round} of Dot Detective.
                <br>Round ${round + 1} will begin in:</p>
                <p><span style="color: red; font-size: 40px">${jsPsych.timelineVariable('toc')}</span> seconds.</p>
            </div>`;
            return html;
        },
        choices: "NO_KEYS",
        trial_duration: 1000,
    };

    // timelines
    const countdown = {
        timeline: [clock],
        timeline_variables: secondsLeft,
        conditional_function: function () {
            return settings.nRounds != round
        }
    };

    const trial = {
        timeline: [probe, feedback],
        randomize_order: true,
        timeline_variables: design,
        on_timeline_start: function() {
            round++
        },
    };

    p.practice = {
        timeline: [probe, feedback],
        randomize_order: true,
        timeline_variables: designPractice,
    };

    p.block = {
        timeline: [trial],
        repetitions: 1,
        on_timeline_finish: () => {
            let mdn_rt = jsPsych.data.get().filter({round: round, trialType: "probe"}).select('rt').median();
            if (mdn_rt < 300) {
                jsPsych.data.addProperties({boot: true, bootReason: 'tooFast'});
                jsPsych.endExperiment("The experiment has ended early due to overly-fast responding.");
            };
        }
    };

   /*
    *
    *   QUESTIONS
    *
    */

    p.consent = {
        type: jsPsychExternalHtml,
        url: "./static/consent.html",
        cont_btn: "advance",
    };

    p.demographics = (function() {

        const taskComplete = {
            type: jsPsychInstructions,
            pages: [`<div class='parent' style='color: rgb(109, 112, 114)'>
                    <p>Dot detective is now complete!</p>
                    <p>To finish this study, please continue to a few final surveys.</p>
                    </div>`], 
            show_clickable_nav: true,
            post_trial_gap: 500,
            allow_keys: false,
        };

        const genFlowScale = ['-2<br>Totally<br>Disagree', '-1<br>Disagree', '0<br>Neither agree<br>nor disagree', '1<br>Agree', '2<br>Totally<br>Agree'];
        const flowProneScale = ['0<br>Never', '1<br>Rarely', '2<br>Sometimes', '3<br>Often', '4<br>Everyday, or almost everyday'];
        const nfcScale = ['-2<br>Extremely<br>Uncharacteristic', '-2<br>Somewhat<br>Uncharacteristic', '0<br>Uncertain', '1<br>Somewhat<br>Characteristic', '2<br>Extremely<br>Characteristic'];
        const curiosityScale = ['1<br>Almost<br>Never', '2<br>Sometimes', '3<br>Often', '4<br>Almost<br>Always'];

        const autotelicQuestions = {
            type: jsPsychSurveyLikert,
            preamble:
                `<div style='padding-top: 50px; width: 900px; font-size:16px'>
                    <p>The following statements describe how you might perceive yourself. As every individual is unique, you may find some of the statements describe you well and some of them don't.</p>
                    <p>Please express the extent to which you disagree or agree with each statement. We appreciate your effort.</p>
                </div>`,
            questions: [
                {
                    prompt: `I am curious about the world.`,
                    name: `ap_1_curiosity`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `I am good at finishing projects.`,
                    name: `ap_2_persistence`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `I worry about how people view me.`,
                    name: `ap_3_sc_r`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `I would choose a job that I enjoy over a job that pays more.`,
                    name: `ap_4_IM`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `I enjoy playing difficult games.`,
                    name: `ap_5_challenge`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `I have fun doing things that others say are boring.`,
                    name: `ap_6_boredom`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `I find it hard to choose where my attention goes.`,
                    name: `ap_7_ctrl_r`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `I actively seek all the information I can about a new situation.`,
                    name: `ap_8_curiosity`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `When a task becomes difficult, I keep going until I complete it.`,
                    name: `ap_9_persistence`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `I worry about being laughed at.`,
                    name: `ap_10_sc_r`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `I think the process of completing a task is its own reward.`,
                    name: `ap_11_IM`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `I would prefer a job that is challenging over a job that is easy.`,
                    name: `ap_12_challenge`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `I am able to find pleasure even in routine types of work.`,
                    name: `ap_13_boredom`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `I get distracted easily.`,
                    name: `ap_14_ctrl_r`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `I take time to explore my surroundings.`,
                    name: `ap_15_curiosity`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `I complete tasks even when they are hard.`,
                    name: `ap_16_persistence`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `I am easily affected by others' impressions of me.`,
                    name: `ap_17_sc_r`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `I care more about enjoyment of a task than rewards associated with it.`,
                    name: `ap_18_IM`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `I like solving complex problems.`,
                    name: `ap_19_challenge`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `Repetitive tasks can be enjoyable.`,
                    name: `ap_20_boredom`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `It is hard for me to stay on task.`,
                    name: `ap_21_ctrl_r`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `Curiosity is the driving force behind much of what I do.`,
                    name: `ap_22_curiosity`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `I keep working on a problem until I solve it.`,
                    name: `ap_23_persistence`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `I am afraid of making the wrong impression.`,
                    name: `ap_24_sc_r`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `What matters most to me is enjoying the things I do.`,
                    name: `ap_25_IM`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `I make a game out of chores.`,
                    name: `ap_26_boredom`,
                    labels: genFlowScale,
                    required: true,
                },
            ],
            randomize_question_order: false,
            scale_width: 500,
            on_finish: (data) => {
                dmPsych.saveSurveyData(data); 
            },
        };

        const flowGenQuestions = {
            type: jsPsychSurveyLikert,
            preamble:
                `<div style='padding-top: 50px; width: 900px; font-size:16px'>
                    <p>Please express the extent to which you disagree or agree with each statement.</p>
                </div>`,
            questions: [
                {
                    prompt: `I enjoy challenging tasks/activities that require a lot of focus.`,
                    name: `genFlow_1`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `When I am focused on a task/activity, I quickly tend to forget my surroundings (other people, time, and place).`,
                    name: `genFlow_2`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `I usually experience a good flow when I do something (things that are neither too easy nor too difficult for me).`,
                    name: `genFlow_3`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `I have several different areas of interest.`,
                    name: `genFlow_4`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `It is difficult for me to walk away from or quit a project I am currently working on.`,
                    name: `genFlow_5`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `I become stressed in the face of difficult/challenging tasks.`,
                    name: `genFlow_6r`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `It is difficult for me to maintain concentration over time.`,
                    name: `genFlow_7r`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `I quickly become tired of the things I do.`,
                    name: `genFlow_8r`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `I am usually satisfied with the results of my efforts across various tasks (I experience feelings of mastery).`,
                    name: `genFlow_9`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `When I focus on something, I often forget to take a break.`,
                    name: `genFlow_10`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `I get bored easily.`,
                    name: `genFlow_11r`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `My daily tasks are exhausting rather than stimulating.`,
                    name: `genFlow_12r`,
                    labels: genFlowScale,
                    required: true,
                },
                {
                    prompt: `I develop an interest for most of the things I do in life.`,
                    name: `genFlow_13`,
                    labels: genFlowScale,
                    required: true,
                },
            ],
            randomize_question_order: false,
            scale_width: 500,
            on_finish: (data) => {
                dmPsych.saveSurveyData(data); 
            },
        };

        const curiosity = {
            type: jsPsychSurveyLikert,
            preamble:
                `<div style='padding-top: 50px; width: 900px; font-size:16px'>
                    <p>For each of the following statements, please describe how frequently it applies to you.</p>
                </div>`,
            questions: [
                {
                    prompt: `I enjoy exploring new ideas.`,
                    name: `curiosity_i_1`,
                    labels: curiosityScale,
                    required: true,
                },
                {
                    prompt: `I find it fascinating to learn new information.`,
                    name: `curiosity_i_2`,
                    labels: curiosityScale,
                    required: true,
                },
                {
                    prompt: `I enjoy learning about subjects that are unfamiliar to me.`,
                    name: `curiosity_i_3`,
                    labels: curiosityScale,
                    required: true,
                },
                {
                    prompt: `When I learn something new, I like to find out more about it.`,
                    name: `curiosity_i_4`,
                    labels: curiosityScale,
                    required: true,
                },
                {
                    prompt: `I enjoy discussing abstract concepts.`,
                    name: `curiosity_i_5`,
                    labels: curiosityScale,
                    required: true,
                },
                {
                    prompt: `Difficult conceptual problems keep me awake all night thinking about solutions.`,
                    name: `curiosity_d_1`,
                    labels: curiosityScale,
                    required: true,
                },
                {
                    prompt: `I will spend hours on a single problem because I just can't rest without knowing the answer.`,
                    name: `curiosity_d_2`,
                    labels: curiosityScale,
                    required: true,
                },
                {
                    prompt: `I feel frustrated if I can't figure out the solution to a problem, so I work even harder to solve it.`,
                    name: `curiosity_d_3`,
                    labels: curiosityScale,
                    required: true,
                },
                {
                    prompt: `I brood for a long time in an attempt to solve some fundamental problem.`,
                    name: `curiosity_d_4`,
                    labels: curiosityScale,
                    required: true,
                },
                {
                    prompt: `I work like a fiend at problems that I feel must be solved.`,
                    name: `curiosity_d_5`,
                    labels: curiosityScale,
                    required: true,
                },
            ],
            randomize_question_order: false,
            scale_width: 500,
            on_finish: (data) => {
                dmPsych.saveSurveyData(data); 
            },
        };

        const flowProne_1 = {
            type: jsPsychSurveyLikert,
            preamble:
                `<div style='padding-top: 50px; width: 900px; font-size:16px'>
                    <p>When you are doing household work or other routine chores (e.g. cooking, cleaning, shopping)<br>how often does it happen that...</p>
                </div>`,
            questions: [
                {
                    prompt: `...you feel bored?`,
                    name: `flowProne_1`,
                    labels: flowProneScale,
                    required: true,
                },
                {
                    prompt: `...it feels as if your ability to perform what you do completely matches how difficult it is?`,
                    name: `flowProne_2`,
                    labels: flowProneScale,
                    required: true,
                },
                {
                    prompt: `...you have a clear picture of what you want to achieve, and what you need to do to get there?`,
                    name: `flowProne_3`,
                    labels: flowProneScale,
                    required: true,
                },
                {
                    prompt: `...you are conscious of how well or poorly you perform what you are doing?`,
                    name: `flowProne_4`,
                    labels: flowProneScale,
                    required: true,
                },
                {
                    prompt: `...you feel completely concentrated?`,
                    name: `flowProne_5`,
                    labels: flowProneScale,
                    required: true,
                },
                {
                    prompt: `...you have a sense of complete control?`,
                    name: `flowProne_6`,
                    labels: flowProneScale,
                    required: true,
                },
                {
                    prompt: `...what you do feels extremely enjoyable to do?`,
                    name: `flowProne_7`,
                    labels: flowProneScale,
                    required: true,
                },
            ],
            randomize_question_order: false,
            scale_width: 500,
            on_finish: (data) => {
                dmPsych.saveSurveyData(data); 
            },
        };

        const flowProne_2 = {
            type: jsPsychSurveyLikert,
            preamble:
                `<div style='padding-top: 50px; width: 900px; font-size:16px'>
                    <p>When you do something in your leisure time, how often does it happen that...</p>
                </div>`,
            questions: [
                {
                    prompt: `...you feel bored?`,
                    name: `flowProne_8`,
                    labels: flowProneScale,
                    required: true,
                },
                {
                    prompt: `...it feels as if your ability to perform what you do completely matches how difficult it is?`,
                    name: `flowProne_9`,
                    labels: flowProneScale,
                    required: true,
                },
                {
                    prompt: `...you have a clear picture of what you want to achieve, and what you need to do to get there?`,
                    name: `flowProne_10`,
                    labels: flowProneScale,
                    required: true,
                },
                {
                    prompt: `...you are conscious of how well or poorly you perform what you are doing?`,
                    name: `flowProne_11`,
                    labels: flowProneScale,
                    required: true,
                },
                {
                    prompt: `...you feel completely concentrated?`,
                    name: `flowProne_12`,
                    labels: flowProneScale,
                    required: true,
                },
                {
                    prompt: `...you have a sense of complete control?`,
                    name: `flowProne_13`,
                    labels: flowProneScale,
                    required: true,
                },
                {
                    prompt: `...what you do feels extremely enjoyable to do?`,
                    name: `flowProne_14`,
                    labels: flowProneScale,
                    required: true,
                },
            ],
            randomize_question_order: false,
            scale_width: 500,
            on_finish: (data) => {
                dmPsych.saveSurveyData(data); 
            },
        };

        const nfc = {
            type: jsPsychSurveyLikert,
            preamble:
                `<div style='padding-top: 50px; width: 900px; font-size:16px'>
                    <p>For each statement below, indicate how well it describes you.</p>
                </div>`,
            questions: [
                {
                    prompt: `I would prefer complex to simple problems.`,
                    name: `nfc_1`,
                    labels: nfcScale,
                    required: true,                    
                },
                {
                    prompt: `I like to have the responsibility of handling a situation that requires a lot of thinking.`,
                    name: `nfc_2`,
                    labels: nfcScale,
                    required: true,
                },
                {
                    prompt: `Thinking is not my idea of fun.`,
                    name: `nfc_3_r`,
                    labels: nfcScale,
                    required: true,
                },
                {
                    prompt: `I would rather do something that requires little thought than something that is sure to challenge my thinking abilities.`,
                    name: `nfc_4_r`,
                    labels: nfcScale,
                    required: true,
                },
                {
                    prompt: `I really enjoy a task that involves coming up with new solutions to problems.`,
                    name: `nfc_5`,
                    labels: nfcScale,
                    required: true,
                },
                {
                    prompt: `I would prefer a task that is intellectual, difficult, and important to one that is somewhat important but does not require much thought.`,
                    name: `nfc_6`,
                    labels: nfcScale,
                    required: true,
                },
            ],
            randomize_question_order: false,
            scale_width: 600,
            on_finish: (data) => {
                dmPsych.saveSurveyData(data); 
            },
        };

        const gender = {
            type: jsPsychSurveyHtmlForm,
            preamble: '<p>What is your gender?</p>',
            html: `<div style="text-align: left">
            <p>Male <input name="gender" type="radio" value="male"/></p>
            <p>Female <input name="gender" type="radio" value="female"/></p>
            <p>Other: <input name="other" type="text"/></p>
            </div>`,
            on_finish: (data) => {
                data.gender = data.response.gender;
                data.gender_other = data.response.other;
            }
        };

        const age = {
            type: jsPsychSurveyText,
            questions: [{prompt: "Age:", name: "age"}],
            on_finish: (data) => {
                dmPsych.saveSurveyData(data); 
            },
        }; 

        const ethnicity = {
            type: jsPsychSurveyHtmlForm,
            preamble: '<p>What is your race / ethnicity?</p>',
            html: `<div style="text-align: left">
            <p>White / Caucasian <input name="ethnicity" type="radio" value="white"/></p>
            <p>Black / African American <input name="ethnicity" type="radio" value="black"/></p>
            <p>East Asian (e.g., Chinese, Korean, Vietnamese, etc.) <input name="ethnicity" type="radio" value="east-asian"/></p>
            <p>South Asian (e.g., Indian, Pakistani, Sri Lankan, etc.) <input name="ethnicity" type="radio" value="south-asian"/></p>
            <p>Latino / Hispanic <input name="ethnicity" type="radio" value="hispanic"/></p>
            <p>Middle Eastern / North African <input name="ethnicity" type="radio" value="middle-eastern"/></p>
            <p>Indigenous / First Nations <input name="ethnicity" type="radio" value="indigenous"/></p>
            <p>Bi-racial <input name="ethnicity" type="radio" value="indigenous"/></p>
            <p>Other <input name="other" type="text"/></p>
            </div>`,
            on_finish: (data) => {
                data.ethnicity = data.response.ethnicity;
                data.ethnicity_other = data.response.other;
            }
        };

        const english = {
            type: jsPsychHtmlButtonResponse,
            stimulus: '<p>Is English your native language?:</p>',
            choices: ['Yes', 'No'],
            on_finish: (data) => {
                data.english = data.response;
            }
        };  

        const finalWord = {
            type: jsPsychSurveyText,
            questions: [{prompt: "Questions? Comments? Complains? Provide your feedback here!", rows: 10, columns: 100, name: "finalWord"}],
            on_finish: (data) => {
                dmPsych.saveSurveyData(data); 
            },
        }; 

        const demos = {
            timeline: [flowGenQuestions, curiosity, flowProne_1, flowProne_2, gender, age, ethnicity, english, finalWord]
        };

        return demos;

    }());

    p.save_data = {
        type: jsPsychPipe,
        action: "save",
        experiment_id: "T8tcrzw1fnBG",
        filename: dmPsych.filename,
        data_string: ()=>jsPsych.data.get().csv()
    };


    return p;

}());


// create timeline
const timeline = [
    exp.consent, 
    exp.prePractice, 
    exp.practice, 
    exp.postPractice,
    exp.attnChk1,
    exp.block, 
    exp.postRound_1,
    exp.attnChk2,
    exp.block,
    exp.postTask, 
    exp.demographics, 
    exp.save_data];

// initiate timeline
jsPsych.run(timeline);

