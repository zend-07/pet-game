console.log(`connecting to your pet friend...`);

/* * * * * * * * * LANGUAGE SYSTEM * * * * * * * * */
const translations = {
    zh: {
        title: 'AOI 的電子寵物朋友',
        upload: '上傳照片',
        play: '玩耶',
        feed: '餐食',
        sleep: '睡覺',
        characterType: '角色類型',
        cat: '貓咪',
        koala: '無尾熊',
        secret: '隱藏款',
        rabbit: '兔子',
        random: '隨機角色',
        selectFace: '圈選臉部區域',
        confirm: '確認',
        cancel: '取消',
        adjustPosition: '位置微調',
        enlarge: '放大',
        shrink: '縮小',
        preview: '預覽',
        previewEffect: '預覽',
        close: '關閉',
        touchDragFace: '觸控拖拽選臉部',
        dragSelectFace: '拖拽圈選臉部區域',
        faceSelected: '已選取臉部區域，可用按鈕微調',
        deviceStyleLabel: '機器風格',
        deviceStyle1: '風格1',
        deviceStyle2: '風格2',
        deviceStyle3: '風格3',
        deviceStyle4: '風格4',
        deviceStyle5: '風格5'
    },

    ja: {
        title: 'AOIのデジタルペット友達',
        upload: '写真アップロード',
        play: '遊ぶ',
        feed: '餌',
        sleep: '眠る',
        characterType: 'キャラクタータイプ',
        cat: '猫',
        koala: 'コアラ',
        secret: 'シークレット',
        rabbit: 'うさぎ',
        random: 'ランダムキャラクター',
        selectFace: '顔領域を選択',
        confirm: '確認',
        cancel: 'キャンセル',
        adjustPosition: '位置微調整',
        enlarge: '拡大',
        shrink: '縮小',
        preview: 'プレビュー',
        previewEffect: 'プレビュー',
        close: '閉じる',
        touchDragFace: 'タッチで顔選択',
        dragSelectFace: 'ドラッグで顔選択',
        faceSelected: '顔選択完了、ボタンで微調整可能',
        deviceStyleLabel: 'デバイススタイル',
        deviceStyle1: 'スタイル1',
        deviceStyle2: 'スタイル2',
        deviceStyle3: 'スタイル3',
        deviceStyle4: 'スタイル4',
        deviceStyle5: 'スタイル5'
    }
};

let currentLang = 'ja';

// 初始化時立即更新為日文
window.addEventListener('DOMContentLoaded', () => {
    updateLanguage('ja');
});

function updateLanguage(lang) {
    currentLang = lang;
    const t = translations[lang];
    document.getElementById('gameTitle').textContent = t.title;
    document.getElementById('uploadBtn').textContent = t.upload;
    document.getElementById('randomBtn').textContent = t.random;
    document.getElementById('play-text').textContent = t.play;
    document.getElementById('feed-text').textContent = t.feed;
    document.getElementById('sleep-text').textContent = t.sleep;
    document.getElementById('characterTypeLabel').textContent = t.characterType;
    document.getElementById('deviceStyleLabel').textContent = t.deviceStyleLabel;
    document.getElementById('selectFaceTitle').textContent = t.selectFace;
    
    // 更新機器風格選項
    const deviceSelect = document.getElementById('deviceStyle');
    if (deviceSelect) {
        deviceSelect.options[0].textContent = t.deviceStyle1;
        deviceSelect.options[1].textContent = t.deviceStyle2;
        deviceSelect.options[2].textContent = t.deviceStyle3;
        deviceSelect.options[3].textContent = t.deviceStyle4;
        deviceSelect.options[4].textContent = t.deviceStyle5;
    }
    // 更新臉部選擇界面文字
    const confirmBtn = document.getElementById('confirmFace');
    if (confirmBtn) confirmBtn.textContent = t.confirm;
    const cancelBtn = document.getElementById('cancelFace');
    if (cancelBtn) cancelBtn.textContent = t.cancel;
    const previewBtn = document.getElementById('previewFace');
    if (previewBtn) previewBtn.textContent = t.preview;
    const adjustLabel = document.getElementById('adjustPositionLabel');
    if (adjustLabel) adjustLabel.textContent = t.adjustPosition;
    const sizeUpBtn = document.getElementById('sizeUp');
    if (sizeUpBtn) sizeUpBtn.title = t.enlarge;
    const sizeDownBtn = document.getElementById('sizeDown');
    if (sizeDownBtn) sizeDownBtn.title = t.shrink;
    
    // 更新預覽視窗文字
    const previewTitle = document.querySelector('.preview-content h3');
    if (previewTitle) previewTitle.textContent = t.previewEffect;
    const closeBtn = document.getElementById('closePreview');
    if (closeBtn) closeBtn.textContent = t.close;
    
    // 更新選項文字
    const characterSelect = document.getElementById('characterType');
    characterSelect.options[0].textContent = t.cat;
    characterSelect.options[1].textContent = t.koala;
    characterSelect.options[2].textContent = t.secret;
    characterSelect.options[3].textContent = t.rabbit;
}

/* * * * * * * * * CACHED ELEMENT REFERENCES * * * * * * * * */

const languageSelect = document.querySelector('#languageSelect');
const characterTypeSelect = document.querySelector('#characterType');
const deviceStyleSelect = document.querySelector('#deviceStyle');
const uploadBtn = document.querySelector('#uploadBtn');
const randomBtn = document.querySelector('#randomBtn');
const photoUpload = document.querySelector('#photoUpload');
const petCanvas = document.querySelector('#petCanvas');
const ctx = petCanvas.getContext('2d');

// 臉部圈選相關元素
const faceSelector = document.querySelector('#faceSelector');
const photoCanvas = document.querySelector('#photoCanvas');
const photoCtx = photoCanvas.getContext('2d');
const confirmFaceBtn = document.querySelector('#confirmFace');
const cancelFaceBtn = document.querySelector('#cancelFace');
const previewWindow = document.querySelector('#previewWindow');
const previewCanvas = document.querySelector('#previewCanvas');
const previewCtx = previewCanvas.getContext('2d');

// 圈選狀態
let isSelecting = false;
let isSelected = false;
let startX, startY, endX, endY;
let currentPhoto = null;
let faceAdjustment = { x: 0, y: 0, scale: 1.0 };

// 隨機角色系統
let characterSprites = [];
let currentCharacterIndex = 0;
const animalTypes = ['Cat_4.png', 'Koala_4.png', 'Secret_4.png', 'Rabbit_4.png'];
let loadedCount = 0;
let catSprites = {};
let koalaSprites = {};
let secretSprites = {};
let rabbitSprites = {};

// 載入角色圖片
function loadCharacterSprites() {
    animalTypes.forEach((animalFile, index) => {
        const img = new Image();
        img.onload = function() {
            const spriteWidth = img.width / 2;
            const spriteHeight = img.height / 2;
            
            if (animalFile === 'Cat_4.png') {
                catSprites.normal = createSpriteCanvas(img, 0, 0, spriteWidth, spriteHeight);
                catSprites.eating = createSpriteCanvas(img, spriteWidth, 0, spriteWidth, spriteHeight);
                catSprites.playing = createSpriteCanvas(img, 0, spriteHeight, spriteWidth, spriteHeight);
                catSprites.sleeping = createSpriteCanvas(img, spriteWidth, spriteHeight, spriteWidth, spriteHeight);
                characterSprites[index] = catSprites.normal;
            } else if (animalFile === 'Koala_4.png') {
                koalaSprites.normal = createSpriteCanvas(img, 0, 0, spriteWidth, spriteHeight);
                koalaSprites.eating = createSpriteCanvas(img, spriteWidth, 0, spriteWidth, spriteHeight);
                koalaSprites.sleeping = createSpriteCanvas(img, 0, spriteHeight, spriteWidth, spriteHeight);
                koalaSprites.playing = createSpriteCanvas(img, spriteWidth, spriteHeight, spriteWidth, spriteHeight);
                characterSprites[index] = koalaSprites.normal;
            } else if (animalFile === 'Secret_4.png') {
                secretSprites.normal = createSpriteCanvas(img, 0, 0, spriteWidth, spriteHeight);
                secretSprites.eating = createSpriteCanvas(img, spriteWidth, 0, spriteWidth, spriteHeight);
                secretSprites.playing = createSpriteCanvas(img, 0, spriteHeight, spriteWidth, spriteHeight);
                secretSprites.sleeping = createSpriteCanvas(img, spriteWidth, spriteHeight, spriteWidth, spriteHeight);
                characterSprites[index] = secretSprites.normal;
            } else if (animalFile === 'Rabbit_4.png') {
                rabbitSprites.normal = createSpriteCanvas(img, 0, 0, spriteWidth, spriteHeight);
                rabbitSprites.eating = createSpriteCanvas(img, spriteWidth, 0, spriteWidth, spriteHeight);
                rabbitSprites.playing = createSpriteCanvas(img, 0, spriteHeight, spriteWidth, spriteHeight);
                rabbitSprites.sleeping = createSpriteCanvas(img, spriteWidth, spriteHeight, spriteWidth, spriteHeight);
                characterSprites[index] = rabbitSprites.normal;
            } else {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 64;
                canvas.height = 64;
                ctx.drawImage(img, 0, 0, 64, 64);
                characterSprites[index] = canvas;
            }
            
            loadedCount++;
            if (loadedCount === animalTypes.length) {
                assignRandomCharacter();
            }
        };
        img.onerror = function() {
            console.error(`無法載入: ${animalFile}`);
            loadedCount++;
            if (loadedCount === animalTypes.length) {
                assignRandomCharacter();
            }
        };
        img.src = animalFile;
    });
}

// 創建精靈 canvas
function createSpriteCanvas(img, x, y, width, height) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 64;
    canvas.height = 64;
    ctx.drawImage(img, x, y, width, height, 0, 0, 64, 64);
    return canvas;
}



// 分配隨機角色
function assignRandomCharacter() {
    if (characterSprites.length > 0) {
        currentCharacterIndex = Math.floor(Math.random() * characterSprites.length);
        drawSpriteCharacter();
        console.log(`隨機選擇了: ${animalTypes[currentCharacterIndex].replace('.png', '')}`);
    }
}

// 繪製精靈角色
function drawSpriteCharacter(state = 'normal') {
    let spriteToUse;
    let hasMultipleStates = false;
    
    if (currentCharacterIndex === 0 && catSprites.normal) {
        spriteToUse = catSprites[state] || catSprites.normal;
        hasMultipleStates = true;
    } else if (currentCharacterIndex === 1 && koalaSprites.normal) {
        spriteToUse = koalaSprites[state] || koalaSprites.normal;
        hasMultipleStates = true;
    } else if (currentCharacterIndex === 2 && secretSprites.normal) {
        spriteToUse = secretSprites[state] || secretSprites.normal;
        hasMultipleStates = true;
    } else if (currentCharacterIndex === 3 && rabbitSprites.normal) {
        spriteToUse = rabbitSprites[state] || rabbitSprites.normal;
        hasMultipleStates = true;
    } else {
        spriteToUse = characterSprites[currentCharacterIndex];
    }
    
    if (spriteToUse) {
        if (window.currentFace && window.currentFaceConfig && hasMultipleStates) {
            applyFaceToSprite(spriteToUse, window.currentFace, window.currentFaceConfig);
        } else {
            ctx.clearRect(0, 0, 64, 64);
            ctx.drawImage(spriteToUse, 0, 0);
        }
    }
}



// 生成角色函數
function generateCharacter(imageData) {
    const data = imageData.data;
    const colors = [];
    
    // 提取主要顏色
    for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 0) { // 非透明像素
            const r = Math.floor(data[i] / 64) * 64;
            const g = Math.floor(data[i + 1] / 64) * 64;
            const b = Math.floor(data[i + 2] / 64) * 64;
            colors.push(`rgb(${r},${g},${b})`);
        }
    }
    
    // 找出最常出現的顏色
    const colorCount = {};
    colors.forEach(color => colorCount[color] = (colorCount[color] || 0) + 1);
    const mainColor = Object.keys(colorCount).sort((a, b) => colorCount[b] - colorCount[a])[0] || '#FFD700';
    
    return mainColor;
}

// 繪製角色
function drawCharacter(mainColor, type = 'male') {
    ctx.clearRect(0, 0, 64, 64);
    
    if (type === 'pet') {
        // 寵物形態
        ctx.fillStyle = mainColor;
        ctx.fillRect(12, 24, 40, 24); // 身體
        ctx.fillRect(16, 12, 32, 20); // 頭部
        
        // 眼睛
        ctx.fillStyle = '#000';
        ctx.fillRect(22, 18, 4, 4);
        ctx.fillRect(38, 18, 4, 4);
        
        // 鼻子
        ctx.fillRect(30, 24, 4, 2);
        
        // 耳朵
        ctx.fillStyle = mainColor;
        ctx.fillRect(18, 8, 6, 8);
        ctx.fillRect(40, 8, 6, 8);
        
        // 尾巴
        ctx.fillRect(48, 28, 8, 12);
        
    } else {
        // 人類形態
        ctx.fillStyle = mainColor;
        ctx.fillRect(16, 20, 32, 32); // 身體
        ctx.fillRect(20, 8, 24, 20);  // 頭部
        
        // 眼睛
        ctx.fillStyle = '#000';
        ctx.fillRect(24, 16, 4, 4);
        ctx.fillRect(36, 16, 4, 4);
        
        // 嘴巴
        ctx.fillRect(28, 24, 8, 2);
        
        // 手臂
        ctx.fillStyle = mainColor;
        ctx.fillRect(8, 28, 8, 16);
        ctx.fillRect(48, 28, 8, 16);
        
        // 腿
        ctx.fillRect(20, 52, 8, 12);
        ctx.fillRect(36, 52, 8, 12);
        
        if (type === 'female') {
            // 女生特徵 - 頭髮
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(18, 6, 28, 8);
        } else {
            // 男生特徵 - 短髮
            ctx.fillStyle = '#654321';
            ctx.fillRect(22, 6, 20, 6);
        }
    }
}

// 處理照片上傳
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            currentPhoto = img;
            showFaceSelector(img);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// 顯示臉部圈選界面
function showFaceSelector(img) {
    faceSelector.style.display = 'flex';
    
    // 手機版使用較小尺寸
    const isMobile = window.innerWidth <= 800;
    const maxSize = isMobile ? 250 : 300;
    const scale = Math.min(maxSize / img.width, maxSize / img.height);
    const displayWidth = img.width * scale;
    const displayHeight = img.height * scale;
    
    photoCanvas.width = displayWidth;
    photoCanvas.height = displayHeight;
    
    // 繪製照片
    photoCtx.drawImage(img, 0, 0, displayWidth, displayHeight);
    
    // 重設選擇狀態
    isSelecting = false;
    isSelected = false;
    startX = startY = endX = endY = 0;
    
    // 顯示提示文字
    photoCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    photoCtx.fillRect(0, 0, displayWidth, 30);
    photoCtx.fillStyle = 'white';
    photoCtx.font = isMobile ? '12px Arial' : '14px Arial';
    const t = translations[currentLang];
    const tipText = isMobile ? t.touchDragFace : t.dragSelectFace;
    photoCtx.fillText(tipText, 10, 20);
    
    // 手機版自動創建預設選區
    if (isMobile) {
        setTimeout(() => {
            const centerX = displayWidth / 2;
            const centerY = displayHeight / 2;
            const size = Math.min(displayWidth, displayHeight) * 0.4;
            startX = centerX - size / 2;
            startY = centerY - size / 2;
            endX = centerX + size / 2;
            endY = centerY + size / 2;
            isSelected = true;
            drawSelection();
        }, 100);
    }
}

// 隐藏臉部圈選界面
function hideFaceSelector() {
    faceSelector.style.display = 'none';
    currentPhoto = null;
    isSelecting = false;
    isSelected = false;
    faceAdjustment = { x: 0, y: 0, scale: 1.0 };
}

// 繪製橢圓選擇框
function drawSelection() {
    if ((!isSelecting && !isSelected) || !currentPhoto) return;
    
    // 重新繪製照片
    photoCtx.clearRect(0, 0, photoCanvas.width, photoCanvas.height);
    photoCtx.drawImage(currentPhoto, 0, 0, photoCanvas.width, photoCanvas.height);
    
    // 計算橢圓參數
    const centerX = (startX + endX) / 2;
    const centerY = (startY + endY) / 2;
    const radiusX = Math.abs(endX - startX) / 2;
    const radiusY = Math.abs(endY - startY) / 2;
    
    // 繪製橢圓選擇框
    photoCtx.strokeStyle = '#ff0000';
    photoCtx.lineWidth = 3;
    photoCtx.beginPath();
    photoCtx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    photoCtx.stroke();
    
    // 手機版顯示選區提示
    if (window.innerWidth <= 800 && isSelected) {
        photoCtx.fillStyle = 'rgba(255, 0, 0, 0.8)';
        photoCtx.fillRect(0, photoCanvas.height - 25, photoCanvas.width, 25);
        photoCtx.fillStyle = 'white';
        photoCtx.font = '12px Arial';
        const t = translations[currentLang];
        photoCtx.fillText(t.faceSelected, 5, photoCanvas.height - 8);
    }
}

// 更新預覽視窗標題
function updatePreviewTitle() {
    const t = translations[currentLang];
    const previewTitle = document.querySelector('.preview-content h3');
    if (previewTitle) previewTitle.textContent = t.previewEffect;
}

// 預覽臉部貼合效果
function previewFaceOnAnimal() {
    updatePreviewTitle();
    if (!currentPhoto || !isSelected) {
        console.log('無法預覽');
        return;
    }
    
    console.log('開始預覽...');
    
    // 獲取臉部 canvas
    const faceCanvas = createAdjustedFaceCanvas();
    let currentSprite = getCurrentSprite();
    
    if (currentSprite) {
        const animalType = animalTypes[currentCharacterIndex].replace('.png', '').replace('_4', '').toLowerCase();
        let faceConfig = getFaceConfig(animalType);
        
        // 應用微調
        const adjustedConfig = {
            x: faceConfig.x + faceAdjustment.x,
            y: faceConfig.y + faceAdjustment.y,
            width: faceConfig.width * faceAdjustment.scale,
            height: faceConfig.height * faceAdjustment.scale,
            opacity: faceConfig.opacity
        };
        
        // 在預覽 canvas 上繪製
        previewCtx.clearRect(0, 0, 128, 128);
        previewCtx.drawImage(currentSprite, 0, 0, 128, 128);
        
        // 繪製臉部到預覽 canvas
        previewCtx.save();
        
        const centerX = (adjustedConfig.x + adjustedConfig.width / 2) * 2;
        const centerY = (adjustedConfig.y + adjustedConfig.height / 2) * 2;
        const radiusX = (adjustedConfig.width / 2.2) * 2;
        const radiusY = (adjustedConfig.height / 2.2) * 2;
        
        previewCtx.beginPath();
        previewCtx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        previewCtx.clip();
        
        previewCtx.globalCompositeOperation = 'multiply';
        previewCtx.globalAlpha = adjustedConfig.opacity;
        previewCtx.drawImage(faceCanvas, adjustedConfig.x * 2, adjustedConfig.y * 2, adjustedConfig.width * 2, adjustedConfig.height * 2);
        
        previewCtx.restore();
        
        // 顯示預覽視窗
        updatePreviewTitle();
        previewWindow.style.display = 'flex';
    }
}

// 關閉預覽視窗
function closePreview() {
    previewWindow.style.display = 'none';
}

// 獲取當前精靈
function getCurrentSprite() {
    if (currentCharacterIndex === 0 && catSprites.normal) return catSprites.normal;
    if (currentCharacterIndex === 1 && koalaSprites.normal) return koalaSprites.normal;
    if (currentCharacterIndex === 2 && secretSprites.normal) return secretSprites.normal;
    if (currentCharacterIndex === 3 && rabbitSprites.normal) return rabbitSprites.normal;
    return characterSprites[currentCharacterIndex];
}

// 獲取臉部配置
function getFaceConfig(animalType) {
    switch(animalType) {
        case 'cat': return { x: 18, y: 12, width: 28, height: 24, opacity: 0.75 };
        case 'koala': return { x: 16, y: 14, width: 32, height: 28, opacity: 0.7 };
        case 'secret': return { x: 18, y: 14, width: 28, height: 24, opacity: 0.75 };
        case 'rabbit': return { x: 20, y: 20, width: 24, height: 20, opacity: 0.75 };
        default: return { x: 18, y: 14, width: 28, height: 24, opacity: 0.75 };
    }
}

// 創建調整後的臉部 canvas
function createAdjustedFaceCanvas() {
    const scale = currentPhoto.width / photoCanvas.width;
    const centerX = (startX + endX) / 2;
    const centerY = (startY + endY) / 2;
    const radiusX = Math.abs(endX - startX) / 2;
    const radiusY = Math.abs(endY - startY) / 2;
    
    const originalCenterX = centerX * scale;
    const originalCenterY = centerY * scale;
    const originalRadiusX = radiusX * scale;
    const originalRadiusY = radiusY * scale;
    
    const croppedCanvas = document.createElement('canvas');
    const croppedCtx = croppedCanvas.getContext('2d');
    croppedCanvas.width = 64;
    croppedCanvas.height = 64;
    
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    const cropSize = Math.max(originalRadiusX, originalRadiusY) * 2.2;
    tempCanvas.width = cropSize;
    tempCanvas.height = cropSize;
    
    tempCtx.save();
    tempCtx.beginPath();
    tempCtx.ellipse(cropSize/2, cropSize/2, originalRadiusX * 1.1, originalRadiusY * 1.1, 0, 0, 2 * Math.PI);
    tempCtx.clip();
    
    tempCtx.drawImage(currentPhoto, 
        originalCenterX - originalRadiusX * 1.1, originalCenterY - originalRadiusY * 1.1, 
        originalRadiusX * 2.2, originalRadiusY * 2.2,
        0, 0, cropSize, cropSize
    );
    tempCtx.restore();
    
    croppedCtx.drawImage(tempCanvas, 0, 0, 64, 64);
    return croppedCanvas;
}

// 確認選擇的臉部
function confirmFaceSelection() {
    if (!currentPhoto || !isSelected) return;
    
    const faceCanvas = createAdjustedFaceCanvas();
    let currentSprite = getCurrentSprite();
    
    if (currentSprite) {
        const animalType = animalTypes[currentCharacterIndex].replace('.png', '').replace('_4', '').toLowerCase();
        let faceConfig = getFaceConfig(animalType);
        
        // 應用微調
        const adjustedConfig = {
            x: faceConfig.x + faceAdjustment.x,
            y: faceConfig.y + faceAdjustment.y,
            width: faceConfig.width * faceAdjustment.scale,
            height: faceConfig.height * faceAdjustment.scale,
            opacity: faceConfig.opacity
        };
        
        // 儲存調整後的配置
        const hasMultipleStates = (currentCharacterIndex === 0) || (currentCharacterIndex === 1) || (currentCharacterIndex === 2) || (currentCharacterIndex === 3);
        if (hasMultipleStates) {
            window.currentFace = faceCanvas;
            window.currentFaceConfig = adjustedConfig;
        }
        
        applyFaceToSprite(currentSprite, faceCanvas, adjustedConfig);
    }
    
    hideFaceSelector();
}

// 將臉部貼到動物角色上
function applyFaceToAnimal(faceCanvas) {
    let currentSprite;
    
    if (currentCharacterIndex === 0 && catSprites.normal) {
        currentSprite = catSprites.normal;
    } else if (currentCharacterIndex === 1 && koalaSprites.normal) {
        currentSprite = koalaSprites.normal;
    } else if (currentCharacterIndex === 2 && secretSprites.normal) {
        currentSprite = secretSprites.normal;
    } else if (currentCharacterIndex === 3 && rabbitSprites.normal) {
        currentSprite = rabbitSprites.normal;
    } else if (characterSprites[currentCharacterIndex]) {
        currentSprite = characterSprites[currentCharacterIndex];
    } else {
        return;
    }
    
    ctx.clearRect(0, 0, 64, 64);
    ctx.drawImage(currentSprite, 0, 0);
    
    const animalType = animalTypes[currentCharacterIndex].replace('.png', '').replace('_4', '').toLowerCase();
    let faceConfig;
    
    switch(animalType) {
        case 'cat':
            faceConfig = { x: 18, y: 12, width: 28, height: 24, opacity: 0.75 };
            break;
        case 'koala':
            faceConfig = { x: 16, y: 14, width: 32, height: 28, opacity: 0.7 };
            break;
        case 'secret':
            faceConfig = { x: 18, y: 14, width: 28, height: 24, opacity: 0.75 };
            break;
        case 'rabbit':
            faceConfig = { x: 20, y: 24, width: 24, height: 18, opacity: 0.75 };
            break;
        default:
            faceConfig = { x: 18, y: 14, width: 28, height: 24, opacity: 0.75 };
    }
    
    // 儲存臉部來在動畫時使用
    const hasMultipleStates = (currentCharacterIndex === 0) || (currentCharacterIndex === 1) || (currentCharacterIndex === 2) || (currentCharacterIndex === 3);
    if (hasMultipleStates) {
        window.currentFace = faceCanvas;
        window.currentFaceConfig = faceConfig;
    }
    
    applyFaceToSprite(currentSprite, faceCanvas, faceConfig);
}

// 將臉部應用到特定精靈
 function applyFaceToSprite(sprite, faceCanvas, faceConfig) {
    // 先繪製精靈
    ctx.clearRect(0, 0, 64, 64);
    ctx.drawImage(sprite, 0, 0);
    
    // 創建橢圓遮罩來讓臉部更自然
    ctx.save();
    
    // 繪製橢圓裁剪區域
    const centerX = faceConfig.x + faceConfig.width / 2;
    const centerY = faceConfig.y + faceConfig.height / 2;
    const radiusX = faceConfig.width / 2.2;
    const radiusY = faceConfig.height / 2.2;
    
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    ctx.clip();
    
    // 使用混合模式讓臉部更自然地融合
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = faceConfig.opacity;
    
    // 繪製臉部
    ctx.drawImage(faceCanvas, faceConfig.x, faceConfig.y, faceConfig.width, faceConfig.height);
    
    ctx.restore();
    
    // 再次繪製一層輕微的臉部來增加細節
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    ctx.clip();
    
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = 0.3;
    ctx.drawImage(faceCanvas, faceConfig.x, faceConfig.y, faceConfig.width, faceConfig.height);
    
    ctx.restore();
}

// 初始化預設寵物
function drawDefaultPet() {
    loadCharacterSprites();
}

const happyStat = document.querySelector('#happy');
const tummyStat = document.querySelector('#tummy');
const energyStat = document.querySelector('#energy');

const petContainer = document.querySelector('.pet-container');

const buttonContainer = document.querySelector('.button-container');
const feedButton = document.querySelector('#feed');
const feedText = document.querySelector('#feed-text');
const playButton = document.querySelector('#play');
const playText = document.querySelector('#play-text');
const sleepButton = document.querySelector('#sleep');

/* * * * * * * * * * * CLASS * * * * * * * * * * * */

class Pet {
    constructor() { // creates new pet with randomized stats
        this.happiness = Math.floor(Math.random() * 100);
        this.tummy = Math.floor(Math.random() * 100);
        this.energy = Math.floor(Math.random() * 100);
    };

    resetButtons() {
        const t = translations[currentLang];
        playText.innerText = t.play;
        playButton.style.backgroundColor = 'rgb(140, 123, 252)';
        feedText.innerText = t.feed;
        feedButton.style.backgroundColor = 'rgb(140, 123, 252)';
    }

    rejectPlay() {
        playText.innerText = '';
        playButton.style.backgroundColor = 'rgb(140, 123, 252, 0.5)';
    }

    rejectFood() {
        feedText.innerText = '';
        feedButton.style.backgroundColor = 'rgb(140, 123, 252, 0.5)';
    }

    updateStats() {
        this.resetButtons();
        
        if (this.tummy <= 0) { // if starved
            console.log('im getting hangry and dont want to play right now')
            this.happiness -= ((-this.tummy) * 2); // decrease happiness
            this.energy -= ((-this.tummy) * 3); // decrease energy
            this.rejectPlay();
        } else if (this.tummy >= 100) { // if too full
            console.log('im too full! lets take a nap')
            this.energy -= ((this.tummy - 100) * 3); // decrease energy
            this.rejectFood();
            this.rejectPlay(); // only way out is to sleep it off
        }

        if (this.happiness <= 0) { // if depressed
            console.log('im too sad to eat or play right now... lets take a nap')
            this.rejectFood();
            this.rejectPlay();
        }

        if (this.energy <= 0) { // if no energy
            console.log('im too tired to play right now...')
            this.rejectPlay();
        }
        
        if (this.tummy < 0) this.tummy = 0;
        
        if (this.happiness < 0) this.happiness = 0;
        else if (this.happiness > 100) this.happiness = 100;
        
        if (this.energy < 0) this.energy = 0;
        else if (this.energy > 100) this.energy = 100;

        happyStat.innerText = this.happiness;
        tummyStat.innerText = this.tummy;
        energyStat.innerText = this.energy;
    };

    startAction() {
        buttonContainer.classList.add('disable-buttons');
        petContainer.classList.remove('pacing');
        petContainer.classList.add('center-pet');
    }

    endAction() {
        buttonContainer.classList.remove('disable-buttons');
        petContainer.classList.add('pacing');
        petContainer.classList.remove('center-pet');
    }

    animatePet(type) {
        // 檢查是否有多狀態精靈
        const hasMultipleStates = (currentCharacterIndex === 0 && catSprites.normal) ||
                                 (currentCharacterIndex === 1 && koalaSprites.normal) ||
                                 (currentCharacterIndex === 2 && secretSprites.normal) ||
                                 (currentCharacterIndex === 3 && rabbitSprites.normal);
        
        if (hasMultipleStates) {
            drawSpriteCharacter(type);
        } else {
            petCanvas.classList.add(type);
        }
        
        const duration = type === 'playing' ? 5000 : type === 'sleeping' ? 7000 : 3000;
        
        setTimeout(() => {
            if (hasMultipleStates) {
                drawSpriteCharacter('normal');
            } else {
                petCanvas.classList.remove(type);
            }
        }, duration);
    }

    play() {
        if (this.energy > 0) {
            console.log('weeeeeeee!');

            this.startAction();
            this.animatePet('playing');

            this.happiness += Math.floor(Math.random() * 50);
            this.energy -= 20;
            this.tummy -= 25;

            setTimeout(() => {
                this.endAction();
                this.updateStats();
            }, 5000);
        };
    };

    feed() {
        if (this.tummy < 100) {
            console.log('yum, thank u');

            this.startAction();
            this.animatePet('eating');

            this.happiness += Math.floor(Math.random() * 10);
            this.energy += 15;
            this.tummy += 30;

            setTimeout(() => {
                this.endAction();
                this.updateStats();
            }, 3000);
        };
    };

    sleep() {
        console.log('goodnight! honk shoo honk shoo');

        this.startAction();
        this.animatePet('sleeping');

        let mood = Math.floor(Math.random() * 50) * (Math.round(Math.random()) ? 1 : -1);
        let newEnergy = Math.floor(Math.random() * 30) * (mood > 0 ? 1 : -1);

        this.happiness += mood;
        this.energy += newEnergy;
        this.tummy -= Math.floor(Math.random() * 20);

        setTimeout(() => {
            this.endAction();
            console.log(`—— woke up ${mood < 0 ? 'in a worse mood and feel even more tired' : 'feeling refreshed'}`);
            this.updateStats();
        }, 7000);
    };
};

// 初始化
const pet = new Pet();
drawDefaultPet();
pet.updateStats();

// 頁面載入完成後更新為日文
setTimeout(() => {
    updateLanguage('ja');
}, 100);

/* * * * * * * * * * * EVENT LISTENERS * * * * * * * * * * * */

// 事件監聽器
languageSelect.addEventListener('change', (e) => updateLanguage(e.target.value));
deviceStyleSelect.addEventListener('change', (e) => {
    const device = document.querySelector('.tamagotchi-device');
    device.className = 'tamagotchi-device';
    if (e.target.value !== 'default') {
        device.classList.add('style-' + e.target.value);
    }
});
characterTypeSelect.addEventListener('change', () => {
    const selectedType = characterTypeSelect.value;
    const typeIndex = ['cat', 'koala', 'secret', 'rabbit'].indexOf(selectedType);
    if (typeIndex >= 0) {
        currentCharacterIndex = typeIndex;
        if (characterSprites[typeIndex]) {
            drawSpriteCharacter('normal');
        }
    }
});
uploadBtn.addEventListener('click', () => photoUpload.click());
randomBtn.addEventListener('click', () => assignRandomCharacter());
photoUpload.addEventListener('change', handlePhotoUpload);

// 臉部圈選事件 - 滑鼠支援
photoCanvas.addEventListener('mousedown', (e) => {
    const rect = photoCanvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    isSelecting = true;
    isSelected = false;
});

photoCanvas.addEventListener('mousemove', (e) => {
    if (!isSelecting || isSelected) return;
    const rect = photoCanvas.getBoundingClientRect();
    endX = e.clientX - rect.left;
    endY = e.clientY - rect.top;
    drawSelection();
});

photoCanvas.addEventListener('mouseup', (e) => {
    if (isSelecting && Math.abs(endX - startX) > 10 && Math.abs(endY - startY) > 10) {
        isSelecting = false;
        isSelected = true;
        drawSelection();
        console.log('選取完成');
    } else if (isSelecting) {
        isSelecting = false;
        isSelected = false;
    }
});

// 臉部圈選事件 - 觸控支援
photoCanvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const rect = photoCanvas.getBoundingClientRect();
    const touch = e.touches[0];
    startX = touch.clientX - rect.left;
    startY = touch.clientY - rect.top;
    isSelecting = true;
    isSelected = false;
});

photoCanvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!isSelecting || isSelected) return;
    const rect = photoCanvas.getBoundingClientRect();
    const touch = e.touches[0];
    endX = touch.clientX - rect.left;
    endY = touch.clientY - rect.top;
    drawSelection();
});

photoCanvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    if (isSelecting && Math.abs(endX - startX) > 10 && Math.abs(endY - startY) > 10) {
        isSelecting = false;
        isSelected = true;
        drawSelection();
        console.log('觸控選取完成');
    } else if (isSelecting) {
        isSelecting = false;
        isSelected = false;
    }
});

// 事件監聽器 - 使用事件委托來處理動態元素
document.addEventListener('click', (e) => {
    if (e.target.id === 'moveUp') {
        faceAdjustment.y -= 2;
        previewFaceOnAnimal();
    } else if (e.target.id === 'moveDown') {
        faceAdjustment.y += 2;
        previewFaceOnAnimal();
    } else if (e.target.id === 'moveLeft') {
        faceAdjustment.x -= 2;
        previewFaceOnAnimal();
    } else if (e.target.id === 'moveRight') {
        faceAdjustment.x += 2;
        previewFaceOnAnimal();
    } else if (e.target.id === 'sizeUp') {
        faceAdjustment.scale = Math.min(1.5, faceAdjustment.scale + 0.1);
        previewFaceOnAnimal();
    } else if (e.target.id === 'sizeDown') {
        faceAdjustment.scale = Math.max(0.5, faceAdjustment.scale - 0.1);
        previewFaceOnAnimal();
    } else if (e.target.id === 'previewFace') {
        previewFaceOnAnimal();
    } else if (e.target.id === 'confirmFace') {
        confirmFaceSelection();
    } else if (e.target.id === 'cancelFace') {
        hideFaceSelector();
    } else if (e.target.id === 'closePreview') {
        closePreview();
    }
});

// 成就系統
let achievements = {
    careStreak: parseInt(localStorage.getItem('careStreak') || '0'),
    totalFeeds: parseInt(localStorage.getItem('totalFeeds') || '0'),
    totalPlays: parseInt(localStorage.getItem('totalPlays') || '0'),
    perfectDays: parseInt(localStorage.getItem('perfectDays') || '0'),
    lastCareDate: localStorage.getItem('lastCareDate') || ''
};

function updateAchievements(action) {
    const today = new Date().toDateString();
    
    if (action === 'feed') {
        achievements.totalFeeds++;
        localStorage.setItem('totalFeeds', achievements.totalFeeds);
        checkFeedAchievement();
    } else if (action === 'play') {
        achievements.totalPlays++;
        localStorage.setItem('totalPlays', achievements.totalPlays);
        checkPlayAchievement();
    }
    
    // 檢查連續照顧天數
    if (achievements.lastCareDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (achievements.lastCareDate === yesterday.toDateString()) {
            achievements.careStreak++;
        } else {
            achievements.careStreak = 1;
        }
        
        achievements.lastCareDate = today;
        localStorage.setItem('careStreak', achievements.careStreak);
        localStorage.setItem('lastCareDate', today);
        
        checkStreakAchievement();
    }
}

function checkFeedAchievement() {
    if (achievements.totalFeeds === 10) showAchievement('餌マスター！10回餌をあげました！');
    if (achievements.totalFeeds === 50) showAchievement('料理長！50回餌をあげました！');
}

function checkPlayAchievement() {
    if (achievements.totalPlays === 10) showAchievement('遊び上手！10回遊びました！');
    if (achievements.totalPlays === 50) showAchievement('エンターテイナー！50回遊びました！');
}

function checkStreakAchievement() {
    if (achievements.careStreak === 3) showAchievement('3日連続ケア達成！');
    if (achievements.careStreak === 7) showAchievement('1週間連続ケア達成！');
    if (achievements.careStreak === 30) showAchievement('1ヶ月連続ケア達成！');
}

function showAchievement(text) {
    const achievement = document.createElement('div');
    achievement.className = 'achievement-popup';
    achievement.textContent = '🏆 ' + text;
    document.body.appendChild(achievement);
    
    setTimeout(() => {
        achievement.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        achievement.classList.remove('show');
        setTimeout(() => {
            if (achievement.parentNode) {
                achievement.parentNode.removeChild(achievement);
            }
        }, 500);
    }, 3000);
}

// 愛心特效彩蛋
function createHeartEffect(x, y) {
    for (let i = 0; i < 8; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart animate';
        
        // 隨機位置偏移
        const offsetX = (Math.random() - 0.5) * 40;
        const offsetY = (Math.random() - 0.5) * 20;
        
        heart.style.left = (x + offsetX) + 'px';
        heart.style.top = (y + offsetY) + 'px';
        
        // 隨機延遲
        heart.style.animationDelay = (Math.random() * 0.5) + 's';
        
        document.body.appendChild(heart);
        
        // 動畫結束後移除
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 2000);
    }
}

// 粒子效果
function createParticles() {
    for (let i = 0; i < 4; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = '-10px';
        particle.style.animationDelay = Math.random() * 1 + 's';
        particle.style.animationDuration = (Math.random() * 2 + 2) + 's';
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 4000);
    }
}

// 按鈕漣漪效果
function createRipple(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// 隱藏彩蛋計數器
let bowTieClicks = 0;
let lastClickTime = 0;

// 在裝飾條上添加點擊事件
document.addEventListener('click', (e) => {
    const device = document.querySelector('.tamagotchi-device');
    const rect = device.getBoundingClientRect();
    
    // 檢查是否點擊在裝飾條區域
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // 蝴蝴結的位置範圍
    if (clickX >= 160 && clickX <= 200 && clickY >= 15 && clickY <= 45) {
        const currentTime = Date.now();
        
        // 重置計數器如果超過2秒沒點擊
        if (currentTime - lastClickTime > 2000) {
            bowTieClicks = 0;
        }
        
        bowTieClicks++;
        lastClickTime = currentTime;
        
        createHeartEffect(e.clientX, e.clientY);
        
        // 隱藏彩蛋：連續點擊5次
        if (bowTieClicks >= 5) {
            triggerSecretAnimation();
            bowTieClicks = 0;
        }
        
        console.log('♥ 愛心特效觸發！ ♥');
        e.stopPropagation();
    }
});

// 隱藏彩蛋動畫
function triggerSecretAnimation() {
    const device = document.querySelector('.tamagotchi-device');
    device.classList.add('secret-animation');
    
    // 創建彩虹粒子效果
    for (let i = 0; i < 10; i++) {
        setTimeout(() => createParticles(), i * 150);
    }
    
    showAchievement('隠しイースターエッグ発見！');
    
    setTimeout(() => {
        device.classList.remove('secret-animation');
    }, 3000);
}

// 檢查完美狀態
function checkPerfectStatus() {
    if (pet.happiness >= 90 && pet.tummy >= 90 && pet.energy >= 90) {
        const device = document.querySelector('.tamagotchi-device');
        device.classList.add('perfect-glow');
        createParticles();
        
        setTimeout(() => {
            device.classList.remove('perfect-glow');
        }, 5000);
    }
}

// 午夜特殊訊息
function checkMidnightMessage() {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
        showAchievement('真夜中のケア、ありがとう！🌙');
    }
}

// 每分鐘檢查一次午夜
setInterval(checkMidnightMessage, 60000);

// 手機版按鈕文字顯示功能
let buttonTextTimeout;
function showButtonText(buttonId) {
    if (window.innerWidth <= 800) {
        // 隱藏所有按鈕文字
        document.querySelectorAll('.button-text').forEach(text => {
            text.classList.remove('show');
        });
        
        // 顯示點擊的按鈕文字
        const textElement = document.getElementById(buttonId + '-text');
        if (textElement) {
            textElement.classList.add('show');
            
            // 3秒後自動隱藏
            clearTimeout(buttonTextTimeout);
            buttonTextTimeout = setTimeout(() => {
                textElement.classList.remove('show');
            }, 3000);
        }
    }
}

playButton.addEventListener('click', (e) => {
    createRipple(e);
    showButtonText('play');
    updateAchievements('play');
    pet.play();
    setTimeout(checkPerfectStatus, 1000);
});
feedButton.addEventListener('click', (e) => {
    createRipple(e);
    showButtonText('feed');
    updateAchievements('feed');
    pet.feed();
    setTimeout(checkPerfectStatus, 1000);
});
sleepButton.addEventListener('click', (e) => {
    createRipple(e);
    showButtonText('sleep');
    pet.sleep();
    setTimeout(checkPerfectStatus, 1000);
});

// 隱藏重置按鈕
document.getElementById('secretReset').addEventListener('click', () => {
    pet.happiness = 100;
    pet.tummy = 100;
    pet.energy = 100;
    pet.updateStats();
    
    // 立即檢查和觸發完美狀態
    checkPerfectStatus();
    
    showAchievement('デバッグモード！全ステータスMAX！');
    
    console.log('🔧 隱藏重置功能使用！');
});