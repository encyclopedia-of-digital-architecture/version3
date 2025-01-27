// JavaScript dosyası: questionnaire.js

document.addEventListener('DOMContentLoaded', function() {
    const questionnaireBtn = document.getElementById('questionnaire-btn');
    const surveyContainer = document.getElementById('survey-container');

    questionnaireBtn.addEventListener('click', function() {
        // Anket formunu göster veya gizle
        if (surveyContainer.classList.contains('hidden')) {
            surveyContainer.classList.remove('hidden');
        } else {
            surveyContainer.classList.add('hidden');
        }
    });
});
