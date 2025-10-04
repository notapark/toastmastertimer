const { ipcRenderer } = require('electron');

class ToastmasterTimer {
    constructor() {
        this.totalSeconds = 0;
        this.remainingSeconds = 0;
        this.warningTime = 30; // 경고시점 (기본값 30초)
        this.isRunning = false;
        this.isPaused = false;
        this.intervalId = null;
        this.startTime = null; // 타이머 시작 시간
        this.pausedTime = 0; // 일시정지된 총 시간
        
        // 발언 기록 관련
        this.records = JSON.parse(localStorage.getItem('debateRecords') || '[]');
        this.currentSession = '';
        this.currentSpeaker = '';
        this.sessionStartTime = null;
        
        this.initializeElements();
        this.bindEvents();
        this.loadSavedSettings();
    }

    initializeElements() {
        // 화면 요소들
        this.setupScreen = document.getElementById('setup-screen');
        this.timerScreen = document.getElementById('timer-screen');
        this.recordsScreen = document.getElementById('records-screen');
        
        // 입력 요소들
        this.sessionNameInput = document.getElementById('session-name');
        this.speakerNameInput = document.getElementById('speaker-name');
        this.minutesInput = document.getElementById('minutes');
        this.secondsInput = document.getElementById('seconds');
        this.warningTimeInput = document.getElementById('warning-time');
        
        // 버튼들
        this.startBtn = document.getElementById('start-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.stopBtn = document.getElementById('stop-btn');
        this.fullscreenBtn = document.getElementById('fullscreen-btn');
        this.viewRecordsBtn = document.getElementById('view-records-btn');
        this.backToSetupBtn = document.getElementById('back-to-setup-btn');
        this.exportRecordsBtn = document.getElementById('export-records-btn');
        this.clearRecordsBtn = document.getElementById('clear-records-btn');
        
        // 타이머 표시
        this.timeText = document.getElementById('time-text');
        this.timerContainer = document.querySelector('.timer-container');
        this.elapsedTimeDiv = document.getElementById('elapsed-time');
        this.elapsedText = document.getElementById('elapsed-text');
        
        // 발언자 정보 표시
        this.currentSessionDiv = document.getElementById('current-session');
        this.currentSpeakerDiv = document.getElementById('current-speaker');
        
        // 시간 경고
        this.timeWarningDiv = document.getElementById('time-warning');
        
        // 기록 테이블
        this.recordsTbody = document.getElementById('records-tbody');
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startTimer());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.stopBtn.addEventListener('click', () => this.stopTimer());
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        this.viewRecordsBtn.addEventListener('click', () => this.showRecords());
        this.backToSetupBtn.addEventListener('click', () => this.showSetupScreen());
        this.exportRecordsBtn.addEventListener('click', () => this.exportRecords());
        this.clearRecordsBtn.addEventListener('click', () => this.clearRecords());
        
        // Enter 키로 타이머 시작
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !this.isRunning) {
                this.startTimer();
            }
        });
        
        // 숫자 입력 유효성 검사 및 자동 저장
        this.minutesInput.addEventListener('input', () => {
            this.validateInput();
            this.saveSettings();
        });
        this.secondsInput.addEventListener('input', () => {
            this.validateInput();
            this.saveSettings();
        });
        this.warningTimeInput.addEventListener('input', () => {
            this.validateWarningTime();
            this.saveSettings();
        });
    }

    validateInput() {
        // 분 입력 검증 (0-59)
        let minutes = parseInt(this.minutesInput.value) || 0;
        if (minutes > 59) minutes = 59;
        if (minutes < 0) minutes = 0;
        this.minutesInput.value = minutes;

        // 초 입력 검증 (0-59)
        let seconds = parseInt(this.secondsInput.value) || 0;
        if (seconds > 59) seconds = 59;
        if (seconds < 0) seconds = 0;
        this.secondsInput.value = seconds;
    }

    validateWarningTime() {
        // 경고시점 입력 검증 (5-300초)
        let warningTime = parseInt(this.warningTimeInput.value) || 30;
        if (warningTime > 300) warningTime = 300;
        if (warningTime < 5) warningTime = 5;
        this.warningTimeInput.value = warningTime;
    }

    startTimer() {
        const sessionName = this.sessionNameInput.value.trim();
        const speakerName = this.speakerNameInput.value.trim();
        const minutes = parseInt(this.minutesInput.value) || 0;
        const seconds = parseInt(this.secondsInput.value) || 0;
        this.warningTime = parseInt(this.warningTimeInput.value) || 30;
        
        if (!sessionName) {
            alert('세션명을 입력해주세요!');
            return;
        }
        
        if (!speakerName) {
            alert('토론자명을 입력해주세요!');
            return;
        }
        
        if (minutes === 0 && seconds === 0) {
            alert('시간을 입력해주세요!');
            return;
        }

        // 현재 발언 정보 저장
        this.currentSession = sessionName;
        this.currentSpeaker = speakerName;
        this.sessionStartTime = new Date();
        
        this.totalSeconds = minutes * 60 + seconds;
        this.remainingSeconds = this.totalSeconds;
        this.startTime = Date.now();
        this.pausedTime = 0;
        
        this.isRunning = true;
        this.isPaused = false;
        
        this.showTimerScreen();
        this.startCountdown();
    }

    startCountdown() {
        this.intervalId = setInterval(() => {
            if (!this.isPaused) {
                this.updateDisplay();
                this.updateColor();
                // 시간 종료 시 자동 정지 로직 제거 - 발언 종료 버튼을 누를 때까지 계속 카운팅
            }
        }, 1000);
    }

    togglePause() {
        if (this.isRunning) {
            this.isPaused = !this.isPaused;
            this.pauseBtn.textContent = this.isPaused ? '재개' : '일시정지';
            
            if (this.isPaused) {
                // 일시정지 시작 시간 기록
                this.pauseStartTime = Date.now();
            } else {
                // 일시정지 종료 시 일시정지된 시간 누적
                if (this.pauseStartTime) {
                    this.pausedTime += Date.now() - this.pauseStartTime;
                }
            }
        }
    }

    stopTimer() {
        this.isRunning = false;
        this.isPaused = false;
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        // 발언 기록 저장
        this.saveRecord();
        
        // 소요 시간 계산 및 표시
        this.showElapsedTime();
        
        // 3초 후 설정 화면으로 돌아가기
        setTimeout(() => {
            this.showSetupScreen();
            this.resetInputs();
        }, 3000);
    }

    // timerFinished 메서드 제거 - 더 이상 자동으로 호출되지 않음
    // 발언 종료는 stopTimer() 메서드에서만 처리

    updateDisplay() {
        if (this.startTime) {
            const currentTime = Date.now();
            const totalElapsed = currentTime - this.startTime - this.pausedTime;
            const elapsedSeconds = Math.floor(totalElapsed / 1000);
            
            const minutes = Math.floor(elapsedSeconds / 60);
            const seconds = elapsedSeconds % 60;
            const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            this.timeText.textContent = timeString;
        }
    }

    updateColor() {
        // 기존 색상 클래스 제거
        this.timerContainer.classList.remove('timer-green', 'timer-yellow', 'timer-red');
        
        if (this.startTime) {
            const currentTime = Date.now();
            const totalElapsed = currentTime - this.startTime - this.pausedTime;
            const elapsedSeconds = Math.floor(totalElapsed / 1000);
            const remainingSeconds = this.totalSeconds - elapsedSeconds;
            
            if (remainingSeconds > this.warningTime) {
                // 경고시점 초과: 초록색
                this.timerContainer.classList.add('timer-green');
                this.timeWarningDiv.classList.add('hidden');
            } else if (remainingSeconds > 0) {
                // 경고시점 이하: 노란색
                this.timerContainer.classList.add('timer-yellow');
                this.timeWarningDiv.classList.add('hidden');
            } else {
                // 시간 초과: 빨간색 (계속 카운팅)
                this.timerContainer.classList.add('timer-red');
                this.timeWarningDiv.classList.remove('hidden');
            }
        }
    }

    showTimerScreen() {
        this.setupScreen.classList.add('hidden');
        this.timerScreen.classList.remove('hidden');
        this.recordsScreen.classList.add('hidden');
        
        // 현재 발언자 정보 표시
        this.currentSessionDiv.textContent = this.currentSession;
        this.currentSpeakerDiv.textContent = this.currentSpeaker;
        
        this.updateDisplay();
        this.updateColor();
    }

    showSetupScreen() {
        this.timerScreen.classList.add('hidden');
        this.setupScreen.classList.remove('hidden');
        this.hideElapsedTime();
    }

    showElapsedTime() {
        if (this.startTime) {
            const currentTime = Date.now();
            const totalElapsed = currentTime - this.startTime - this.pausedTime;
            const elapsedSeconds = Math.floor(totalElapsed / 1000);
            
            const minutes = Math.floor(elapsedSeconds / 60);
            const seconds = elapsedSeconds % 60;
            const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            this.elapsedText.textContent = timeString;
            this.elapsedTimeDiv.classList.remove('hidden');
        }
    }

    hideElapsedTime() {
        this.elapsedTimeDiv.classList.add('hidden');
    }

    resetInputs() {
        // 저장된 설정값을 유지하도록 수정
        this.loadSavedSettings();
        this.pauseBtn.textContent = '일시정지';
        this.startTime = null;
        this.pausedTime = 0;
        this.pauseStartTime = null;
    }

    toggleFullscreen() {
        if (ipcRenderer) {
            ipcRenderer.invoke('toggle-fullscreen');
        }
    }

    showNotification(message) {
        // 간단한 알림 표시
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px 40px;
            border-radius: 10px;
            font-size: 1.5rem;
            z-index: 1000;
            animation: fadeInOut 3s ease-in-out;
        `;
        
        // CSS 애니메이션 추가
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                20%, 80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
            document.head.removeChild(style);
        }, 3000);
    }

    // 발언 기록 저장
    saveRecord() {
        if (this.startTime && this.sessionStartTime) {
            const currentTime = Date.now();
            const totalElapsed = currentTime - this.startTime - this.pausedTime;
            const elapsedSeconds = Math.floor(totalElapsed / 1000);
            
            const record = {
                id: Date.now(),
                session: this.currentSession,
                speaker: this.currentSpeaker,
                duration: elapsedSeconds,
                startTime: this.sessionStartTime.toLocaleString('ko-KR'),
                endTime: new Date().toLocaleString('ko-KR'),
                timestamp: new Date()
            };
            
            this.records.push(record);
            localStorage.setItem('debateRecords', JSON.stringify(this.records));
        }
    }

    // 기록 화면 표시
    showRecords() {
        this.setupScreen.classList.add('hidden');
        this.timerScreen.classList.add('hidden');
        this.recordsScreen.classList.remove('hidden');
        this.updateRecordsTable();
    }

    // 기록 테이블 업데이트
    updateRecordsTable() {
        this.recordsTbody.innerHTML = '';
        
        if (this.records.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="5" style="text-align: center; padding: 20px;">기록이 없습니다.</td>';
            this.recordsTbody.appendChild(row);
            return;
        }
        
        // 최신 기록부터 표시
        this.records.slice().reverse().forEach(record => {
            const row = document.createElement('tr');
            const minutes = Math.floor(record.duration / 60);
            const seconds = record.duration % 60;
            const durationText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            row.innerHTML = `
                <td>${record.session}</td>
                <td>${record.speaker}</td>
                <td>${durationText}</td>
                <td>${record.startTime}</td>
                <td>${record.endTime}</td>
            `;
            this.recordsTbody.appendChild(row);
        });
    }

    // 기록 내보내기
    exportRecords() {
        if (this.records.length === 0) {
            alert('내보낼 기록이 없습니다.');
            return;
        }
        
        let csvContent = '세션명,토론자,발언시간(초),시작시간,종료시간\n';
        
        this.records.forEach(record => {
            csvContent += `${record.session},${record.speaker},${record.duration},${record.startTime},${record.endTime}\n`;
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `토론기록_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // 기록 삭제
    clearRecords() {
        if (confirm('모든 기록을 삭제하시겠습니까?')) {
            this.records = [];
            localStorage.removeItem('debateRecords');
            this.updateRecordsTable();
            alert('기록이 삭제되었습니다.');
        }
    }

    // 설정 저장
    saveSettings() {
        const settings = {
            minutes: this.minutesInput.value,
            seconds: this.secondsInput.value,
            warningTime: this.warningTimeInput.value
        };
        localStorage.setItem('timerSettings', JSON.stringify(settings));
    }

    // 저장된 설정 불러오기
    loadSavedSettings() {
        const savedSettings = localStorage.getItem('timerSettings');
        if (savedSettings) {
            try {
                const settings = JSON.parse(savedSettings);
                if (settings.minutes !== undefined) {
                    this.minutesInput.value = settings.minutes;
                }
                if (settings.seconds !== undefined) {
                    this.secondsInput.value = settings.seconds;
                }
                if (settings.warningTime !== undefined) {
                    this.warningTimeInput.value = settings.warningTime;
                }
            } catch (error) {
                console.error('설정 불러오기 실패:', error);
            }
        }
    }
}

// 앱 시작
document.addEventListener('DOMContentLoaded', () => {
    new ToastmasterTimer();
});
