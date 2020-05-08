'use strict';
let pages = []; //最终生成的页面列表
let groupRefs = []; //组对象 引用列表
let containerRefs = []; //容器对象 引用列表

let lastQuestion = null;
let g_index = -1; //实际题目（非容器）全局索引

function _createPaperPage(paper) {
    let _paper = {
        // title: paper.name,
        // subTitle: paper.sub_title
    };
    if (paper.name) {
        _paper.title = paper.name;
    }
    if (paper.sub_title) {
        _paper.subTitle = paper.sub_title;
    }
    if (paper.config.name_urls.length > 0) {
        _paper.titleAudio = paper.config.name_urls[0].url;
    }
    pages.push({
        type: 1,
        paper: _paper
    });
}

function _createSectionPage(section) {
    let _section = {
        // title: section.title,
        // description: section.description
    };
    if (section.title) {
        _section.title = section.title;
    }
    if (section.description){
        _section.description = section.description;
    }
    if (section.config.title_urls.length > 0) {
        _section.titleAudio = section.config.title_urls[0].url;
    }
    pages.push({
        type: 2,
        section: _section
    });
}

function _createQuestionPage(questions, container) {
    let _question = {
        questions,
    };
    if (!container.rel_old_type_id) {
        _question.groupRef = container.uid;
    }
    else {
        _question.containerRef = container.uid;
    }

    pages.push({
        type: 3,
        question: _question
    })
}

function _collectGroup(group) {
    const _group = groupRefs.find(g => g.uid === group.uid);
    if (!_group) {
        groupRefs.push(group);
    }
}

function _extractGroup(group) {
    let _group = {
        uid: group.uid,
        // title: group.title,
        // description: group.description,
        // direction: group.directions
    };
    if (group.title) {
        _group.title = group.title;
    }
    if (group.description) {
        _group.description = group.description;
    }
    if (group.directions) {
        _group.direction = group.directions;
    }
    if (group.config.title_urls.length > 0) {
        _group.titleAudio = group.config.title_urls[0].url;
    }
    if (group.config.directions_urls.length > 0) {
        _group.directionAudio = group.config.directions_urls[0].url;
    }
    return _group;
}

function _collectContainer(container) {
    const _container = containerRefs.find(c => c.uid === container.uid);
    if (!_container) {
        containerRefs.push(container);
    }
}

function _extractQuestion(question) {
    let _question = {
        uid: question.uid,
        relOldTypeId: question.rel_old_type_id,
        type: question.type,
    };

    if (question.rel_old_type_id !== 6) {
        _question.answer = question.answer;
        _question.score = question.score;
    }

    _question.displayDirection = !!question.config.display_directions;
    _question.displayBody = !!question.config.display_body_text;
    _question.displayBodyAudio = !!question.config.display_body_audios;

    if (question.config.preparation_time) {
        _question.playPreparation = question.config.preparation_time;
    }
    //作答准备和作答持续时间 对容器无效
    if (question.config.answer_config.preparation_time && question.rel_old_type_id !== 6) {
        _question.answerPreparation = question.config.answer_config.preparation_time;
    }
    if (question.config.answer_config.duration && question.rel_old_type_id !== 6) {
        _question.answerDuration = question.config.answer_config.duration;
    }

    if (question.directions && !question.directions.match(/^\s*<p>(&nbsp;)*<\/p>\s*$/)) {
        _question.direction = question.directions;
    }
    if (question.body && !question.body.match(/^\s*<p>(&nbsp;)*<\/p>\s*$/)) {
        _question.body = question.body;
    }

    _question.doi = question.customize_doi ? question.customize_doi : question.doi;

    if (_question.relOldTypeId === 1) {
        _question.multiple = question.config.multiple;
        _question.options = question.config.options;
    }
    if (question.config.enunciation.directions_urls.length > 0 &&
        question.config.enunciation.directions_urls[0].url) {
        _question.directionAudio = question.config.enunciation.directions_urls[0].url;
    }
    if (question.config.listen.body_urls.length > 0 &&
        question.config.listen.body_urls[0].url) {
        _question.attachedAudio = question.config.listen.body_urls[0].url;
        if (question.config.listen.start_tip_urls.length > 0)
            _question.attachedStartAudio = question.config.listen.start_tip_urls[0].url;
        if (question.config.listen.end_tip_urls.length > 0)
            _question.attachedEndAudio = question.config.listen.end_tip_urls[0].url;
        _question.attachedAudioRepeat = question.config.listen.repeat_count;
        _question.attachedAudioInterval = question.config.listen.intervals;
        if (question.config.listen.body_urls[0].content)
            _question.attachedAudioText = question.config.listen.body_urls[0].content;
    }
    if (question.config.body_audio.body_urls.length > 0 &&
        question.config.body_audio.body_urls[0].url) {
        _question.bodyAudio = question.config.body_audio.body_urls[0].url;
        _question.bodyAudioRepeat = question.config.body_audio.repeat_count;
        _question.bodyAudioInterval = question.config.body_audio.intervals;
        if (question.config.body_audio.body_urls[0].content)
            _question.bodyAudioText = question.config.body_audio.body_urls[0].content;
    }
    if (question.rel_old_type_id !== 6 &&
        question.config.answer_config.start_tip_urls.length > 0 &&
        question.config.answer_config.start_tip_urls[0].url) {
        _question.answerStartAudio = question.config.answer_config.start_tip_urls[0].url;
    }
    if (question.rel_old_type_id !== 6 &&
        question.config.answer_config.end_tip_urls.length > 0 &&
        question.config.answer_config.end_tip_urls[0].url) {
        _question.answerEndAudio = question.config.answer_config.end_tip_urls[0].url;
    }
    if (question.config.correct_keywords && question.config.correct_keywords.length > 0)
        _question.correctKeywords = question.config.correct_keywords;
    if (question.config.error_keywords && question.config.error_keywords.length > 0)
        _question.errorKeywords = question.config.error_keywords;

    if (question.qIndex !== undefined)
        _question.qIndex = question.qIndex;
    if (question.containerRef)
        _question.containerRef = question.containerRef;
    if (question.groupRef)
        _question.groupRef = question.groupRef;

    if (question.config.is_reference && lastQuestion && lastQuestion.body) {
        _question.refBody = lastQuestion.body;
    }
    if (_question.relOldTypeId !== 6) { //引用前一题，前一题不能是容器
        lastQuestion = _question;
    }

    return _question;
}


function _handleQuestion(questions, container) {
    if (!container.rel_old_type_id) { //外层是group
        _collectGroup(_extractGroup(container));

        questions.forEach((question, index) => {
            let _question = _extractQuestion(question);
            _question.qIndex = index;
            if (question.rel_old_type_id !== 6) { //不是材料题
                g_index += 1;
                _question.index = g_index;
                _createQuestionPage([_question],container);
            }
            else {
                question.qIndex = index;
                question.groupRef = container.uid;
                _handleQuestion(question.subs, question);
            }
        });
    }
    else {  //外层是材料题
        _collectContainer(_extractQuestion(container));

        let continuousQuestions = []; //连续显示的子题
        questions.forEach((question, index) => {
            if (question.rel_old_type_id !== 6) { //不是材料题
                g_index += 1;
                if (question.config.is_independent_display) {
                    //先把之前连续显示的子题 存档，如果有的话
                    if (continuousQuestions.length > 0) {
                        _createQuestionPage(continuousQuestions, container);
                        continuousQuestions = [];
                    }
                    //独立显示的题目页面
                    let _question = _extractQuestion(question);
                    _question.qIndex = index;
                    _question.index = g_index;
                    _createQuestionPage([_question], container);
                }
                else {
                    if (container.config.is_display_subs) { //外层显示全部子题
                        let _question = _extractQuestion(question);
                        _question.qIndex = index;
                        _question.index = g_index;
                        continuousQuestions.push(_question);
                    }
                    else { //外层不显示全部，题目自身也不独立显示，跳过
                        return true;
                    }
                }
            }
            else { //是材料题
                //先把之前连续显示的子题 存档，如果有的话
                if (continuousQuestions.length > 0) {
                    _createQuestionPage(continuousQuestions, container);
                    continuousQuestions = [];
                }

                question.qIndex = index;
                question.containerRef = container.uid;
                _handleQuestion(question.subs, question);
            }
        });

        if (continuousQuestions.length > 0) {
            _createQuestionPage(continuousQuestions, container);
            continuousQuestions = [];
        }
    }
}

module.exports = paper => {
    pages = [];
    groupRefs = [];
    containerRefs = [];
    lastQuestion = null;
    g_index = -1;

    if (paper.name && !paper.name.match(/^\s+$/)) {
        _createPaperPage(paper);
    }

    paper.sections.forEach(section => {
        if (section.title && !section.title.match(/^\s+$/)) {
            _createSectionPage(section);
        }

        section.groups.forEach(group => {
            _handleQuestion(group.questions, group);
        })
    });

    return {
        ruleId: "20191224",
        ruleDoc: "https://shimo.im/docs/GRccGPtKCPhG68yR",
        uid: paper.uid,
        info: {
            regionId: paper.region_id,
            stageId: paper.stage_id,
            subjectId: paper.subject_id,
        },
        pages,
        groupRefs,
        containerRefs
    }
};
