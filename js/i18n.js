'use strict';
/* ---------- interface language: Chinese (zh) or English (en) ----------
   Only the interface is translated. Dreams can be typed in either language; the lexicon already holds Chinese and English keywords. */
let LANG='zh';
try{LANG=localStorage.getItem('dream-recorder-lang')||(/^zh/i.test(navigator.language||'zh')?'zh':'en');}catch(e){LANG=/^zh/i.test(navigator.language||'zh')?'zh':'en';}
const STR={
  zh:{sound:'声音',soundOn:'声音 开',archive:'档案',samples:'示例',emotion:'情绪',placeholder:'写下你的梦…',go:'生成',close:'关闭',archTitle:'梦境档案',
    tSound:'梦境音景',tArch:'梦境档案',tMic:'语音输入',tLang:'EN',aCanvas:'由梦境文字组成的图像',aEmo:'梦里的情绪',
    hint:'用手指拨动文字',nothing:'没认出具体的东西，按情绪画了这一幅',heard:'识别到：',sep:'、',miss:'少了什么？',missToast:'已记下这个梦，谢谢',
    combo:(w,y)=>`${w}（组合：${y}）`,concept:(w,y)=>`${w}（象征：${y}）`,unclass:w=>`${w}（未归类）`,tarotWord:(w,c,y)=>`${w}（按情绪抽到：${c}，${y}）`,
    reading:(m,e)=>`没认出具体的东西，按情绪抽了三张牌（${m}${e}）`,energyHi:'，激烈',energyLo:'，平缓',
    saved:'已存入梦境档案',savedTrim:'已保存。存储空间不够，较早的缩略图已移除',cloudPending:'正在保存到账号',saveFail:'没有保存：浏览器的存储已满或被禁用',delFail:'无法删除：浏览器的存储不可用',
    tSave:'保存为图片',exported:'图片已保存',exportFail:'无法生成图片',viewSky:'星空',viewList:'列表',open:'打开',delShort:'删除',skyHint:'每团星云是一个梦，形状来自它的画面。拖动旋转，滚轮拉近，点一团星云飞过去，再点一次进入。',skyBack:'返回',skyAria:n=>`梦境星空，共 ${n} 个梦。左右方向键选择，回车进入。也可以切换到列表。`,liveHint:'继续写，画面会跟着变；按“生成”保存',
empty:'还没有记录。生成一个梦，它会自动保存在这里，之后可以重新打开并拨动文字。记录只保存在这个浏览器里。',del:'删除这条记录',
    micErr:'无法使用语音输入，请直接输入文字',micErr2:'无法使用麦克风，请直接输入文字',noSound:'此设备不支持声音',
    boot:'我梦见一朵巨大的向日葵，在海边的风里慢慢转动，月亮挂在天上，我伸手想碰它，它却越来越亮',micLang:'zh-CN',
    samplesList:[['海里飞翔','我在海里游着，忽然像鸟一样飞了起来，风很轻'],['夜晚的门','深夜的楼梯尽头有一扇发光的门，我一直在爬，星星很近'],['旧房子与猫','小时候的老房子，院子里有一只猫，我很想念那里'],['不停坠落','我一直在坠落，什么也抓不住，很害怕']]},
  en:{sound:'Sound',soundOn:'Sound on',archive:'Archive',samples:'Try',emotion:'Mood',placeholder:'Write your dream…',go:'Draw',close:'Close',archTitle:'Dream archive',
    tSound:'Dream soundscape',tArch:'Dream archive',tMic:'Voice input',tLang:'中',aCanvas:'A picture made of the words of a dream',aEmo:'Mood of the dream',
    hint:'Drag a finger through the words',nothing:'Nothing concrete recognised, so this is drawn from the mood',heard:'Recognised: ',sep:', ',miss:'Something missing?',missToast:'Noted, thank you',
    combo:(w,y)=>`${w} (combo: ${y})`,concept:(w,y)=>`${w} (symbol: ${y})`,unclass:w=>`${w} (unclassified)`,tarotWord:(w,c,y)=>`${w} (drawn by mood: ${c}, ${y})`,
    reading:(m,e)=>`Nothing concrete recognised: three cards drawn for the mood (${m}${e})`,energyHi:', intense',energyLo:', still',
    saved:'Saved to your dream archive',savedTrim:'Saved. Storage is nearly full, so older thumbnails were removed',cloudPending:'Saving to your account',saveFail:'Not saved: browser storage is full or turned off',delFail:'Could not delete: browser storage is unavailable',
    tSave:'Save as image',exported:'Image saved',exportFail:'Could not create the image',viewSky:'Sky',viewList:'List',open:'Open',delShort:'Delete',skyHint:'Each nebula is a dream, shaped by its own picture. Drag to turn, scroll to move closer, tap a nebula to fly to it, tap again to enter.',skyBack:'Back',skyAria:n=>`Dream sky with ${n} dreams. Left and right arrow keys select, Enter opens. A list view is also available.`,liveHint:'Keep writing and the picture follows; press Draw to save it',
empty:'Nothing here yet. Draw a dream and it is saved here automatically; reopen it later and push the words around. Records stay in this browser only.',del:'Delete this entry',
    micErr:'Voice input is not available, please type instead',micErr2:'The microphone is not available, please type instead',noSound:'Sound is not supported on this device',
    boot:'I dreamed of a giant sunflower turning slowly in the sea wind, the moon hanging in the sky, and when I reached for it, it grew brighter and brighter',micLang:'en-US',
    samplesList:[['Flying over the sea','I was swimming in the sea when I suddenly rose into the air like a bird, the wind very light'],['A door at night','At the top of a long staircase at midnight there was a glowing door, and I kept climbing, the stars so close'],['Old house and a cat','The old house from my childhood, a cat in the yard, and how much I missed it'],['Endless falling','I kept falling and could not grab anything, and I was terrified']]}
};
STR.zh.skyEmpty='生成并保存梦境后会出现在这里。';
STR.en.skyEmpty='Draw and save a dream to keep it here.';
const tx=(k,...a)=>{const v=(STR[LANG]||STR.zh)[k];return typeof v==='function'?v(...a):v;};
const EMON={en:{calm:'Calm',joy:'Joy',fear:'Fear',sad:'Sad',strange:'Strange',nostalgia:'Nostalgic'}};
const emoName=k=>LANG==='en'?(EMON.en[k]||k):(EMO[k]||EMO.calm).zh;
const SCN={classroom:'classroom',hospital:'hospital',train:'train',plane:'plane',elevator:'lift',bed:'bed',ghost:'ghost',insect:'insects',elephant:'elephant',horse:'horse',tiger:'tiger',lion:'lion',deer:'deer',rabbit:'rabbit',bear:'bear',canine:'dog / wolf',beast:'beast',heart:'heart',clock:'clock',key:'key',boat:'boat',bridge:'bridge',tower:'tower',candle:'candle',umbrella:'umbrella',feather:'feather',crown:'crown',skull:'skull',hourglass:'hourglass',
  cup:'cup',bottle:'bottle',bowl:'bowl / plate',kettle:'pot / kettle',jar:'jar / bucket',box:'box',bag:'bag',suitcase:'suitcase',envelope:'envelope',phone:'phone',laptop:'computer',tv:'TV / screen',camera:'camera',chair:'chair',table:'table',sofa:'sofa / bedding',shirt:'clothes',dress:'dress',hat:'hat',shoe:'shoe',knife:'knife / sword',hammer:'tools',scissors:'scissors',car:'car',bicycle:'bicycle',ball:'ball',egg:'egg',coin:'money',cake:'cake / sweets',bread:'food',picture:'picture',piano:'piano',guitar:'guitar / violin',note:'music / dance',hand:'hand',tooth:'tooth',mouth:'mouth',foot:'foot',gear:'machine',
  sun:'sun',moon:'moon',stars:'stars',cloud:'cloud',rain:'rain',fire:'fire',eye:'eye',cat:'cat',butterfly:'butterfly',flower:'flower',snake:'snake',falling:'falling',road:'road',city:'city',paper:'exam paper',person:'figure',swirl:'swirl',sea:'sea',fish:'fish',fly:'flying',house:'house',door:'door',stairs:'stairs',tree:'tree',forest:'forest',mountain:'mountain'};
const sceneName=n=>n.startsWith('card:')?(LANG==='en'?CARD[n.slice(5)].en:CARD[n.slice(5)].zh):n.startsWith('sym:')?(LANG==='en'?n.slice(4)+' (symbol)':SC[n].zh):(LANG==='en'?(SCN[n]||n):SC[n].zh);
const cardName=f=>LANG==='en'?CARD[f].en:CARD[f].zh;
/* the reasons shown for combo cards and concept shapes (the Chinese text lives in lexicon.js) */
const WHY_EN={'流逝，在夜里':'running out, in the night','心，会开花':'a heart that blooms','终结，与余光':'an ending and its last light','离开地面，没有边界':'off the ground, no limits','火与刃':'fire and blade','加冕，在阳光下':'crowned in the sun','钥匙落在了路上':'the key dropped on the road','伤在心上':'a wound to the heart','心被淋湿':'a heart soaked by rain','礼服与心':'a gown and a heart','孕育，然后绽开':'gestating, then opening','行李与路':'luggage and a road','遮挡，与归处':'cover, and a place to return to','火与兽':'fire and beast','岔路与门':'a fork and a door','年轮':'tree rings','向上的台阶，在云里':'stairs up into the clouds','向下的台阶，在火里':'stairs down into fire','夜里的骨':'bones in the night','轻盈的光':'weightless light','握住的手':'a held hand','帽子与证书':'a cap and a certificate','逝去的人，与烛光':'someone gone, and candlelight','时间在路上耗尽':'time running out on the road','空白的卷子与时间':'a blank paper and the clock','旧的心，碎了':'an old heart, broken','床边的黑影':'a shadow by the bed','被所有人看着':'everyone is looking','门后还是门':'behind the door, another door','牙一颗颗掉落':'teeth falling one by one','路缠成了结':'the road tied in a knot','失控地下坠':'falling out of control','屏幕与时钟':'a screen and a clock','夜里的一封信':'a letter in the night','挥手，然后上路':'a wave, then the road','心与家':'a heart and a home','钱与冠':'money and a crown','刃与冠':'blade and crown',
  '会扩散、会淡去':'it spreads and fades','会传播、起伏':'it travels, rises and falls','围绕与距离':'circling, distance','突然向外迸发':'bursts outward','尖锐、层层逼近':'sharp, closing in','缠绕、解不开':'tangled, hard to undo','透明、发光、易碎':'clear, glowing, fragile','一点点汇聚、孕育':'gathers drop by drop'};
const whyName=y=>LANG==='en'?(WHY_EN[y]||y):y;

/* write the language into the static page and rebuild the pieces that hold text */
function applyLang(){
  document.documentElement.lang=LANG==='en'?'en':'zh-CN';
  document.querySelectorAll('[data-i18n]').forEach(e=>{e.textContent=tx(e.dataset.i18n);});
  document.querySelectorAll('[data-i18n-ph]').forEach(e=>{e.placeholder=tx(e.dataset.i18nPh);});
  document.querySelectorAll('[data-i18n-title]').forEach(e=>{e.title=tx(e.dataset.i18nTitle);});
  document.querySelectorAll('[data-i18n-aria]').forEach(e=>{e.setAttribute('aria-label',tx(e.dataset.i18nAria));});
  const sl=document.getElementById('sndLab');if(sl)sl.textContent=(window.Snd&&Snd.on)?tx('soundOn'):tx('sound');
  if(typeof buildChrome==='function')buildChrome();
  if(typeof renderArchive==='function')renderArchive();
  if(typeof applyEmotion==='function'&&typeof emoKey!=='undefined')applyEmotion(emoKey);
  if(typeof renderCaption==='function'&&cur)renderCaption(cur.src);
}
function setLang(l){LANG=l;try{localStorage.setItem('dream-recorder-lang',l);}catch(e){}applyLang();}
