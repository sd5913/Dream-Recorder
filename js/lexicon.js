'use strict';
/* ---------- lexicon: which words call which scene (edit this file to teach the app new words) ---------- */
/* Format: scene name -> words separated by |.  Chinese words match as substrings; English words match whole words
   (plural / -ing / -ed endings are allowed).  Keep single Chinese characters for very clear cases only. */
const LEX={
  sun:'太阳|日出|日落|阳光|烈日|朝阳|晨光|夕阳|晴天|晴朗|炎热|暖阳|中午|白天|sun|sunrise|sunset|sunshine|sunny|dawn|daylight|summer|noon',
  moon:'月亮|月光|月球|月夜|月圆|满月|弯月|明月|moon|moonlight|crescent|lunar',
  stars:'星|夜|太空|宇宙|银河|地球|行星|宇航员|黑夜|午夜|深夜|流星|许愿|魔法|外星|飞碟|火箭|night|star|midnight|galaxy|universe|space|planet|astronaut|evening|dark|meteor|wish|magic|alien|ufo|rocket',
  cloud:'云|雾|天空|雪|天际|阴天|天堂|漂浮|飘|裂开|光芒|霞|彩虹|大风|风吹|刮风|微风|狂风|cloud|sky|snow|fog|mist|heaven|float|floating|sunlight|rainbow|wind|windy|breeze|haze',
  rain:'雨|暴风|雷|闪电|台风|眼泪|流泪|哭|湿|淋|rain|storm|thunder|lightning|typhoon|tears|cry|crying|wet|drip|drizzle',
  sea:'海|湖|河|水|浪|洪|游泳|游过|游着|潜水|溺水|淹|池塘|瀑布|沙滩|沉没|岛|溪|泳池|sea|ocean|water|lake|river|swim|swimming|wave|flood|beach|dive|drown|pool|waterfall|tide|sink|bath|island|stream|pond|海啸|巨浪|大浪',
  fish:'鱼|鲸|鲨|海豚|章鱼|水母|螃蟹|虾|钓鱼|鱼缸|鱼群|海底|dolphin|octopus|jellyfish|fish|whale|shark|crab|shrimp|aquarium|fishing|seafood|turtle|乌龟',
  fly:'飞|翅|翼|鸟|翔|天使|风筝|气球|降落|起飞|滑翔|升空|直升机|降落伞|鹦鹉|鸽子|乌鸦|老鹰|鹰|天鹅|麻雀|燕子|海鸥|蝙蝠|凤凰|猫头鹰|fly|flying|bird|wing|flies|flew|aircraft|angel|kite|balloon|glide|soar|hover|helicopter|parachute|parrot|pigeon|crow|eagle|hawk|swan|sparrow|swallow|seagull|bat|phoenix|owl|dove',
  house:'房|屋|家里|回家|老家|我家|在家|公寓|阁楼|地下室|客厅|厨房|宿舍|窗|墙|屋顶|天花板|浴室|卫生间|厕所|搬家|house|home|room|dorm|kitchen|apartment|attic|basement|window|wall|roof|ceiling|living room|bathroom|toilet|floor',
  door:'门|走廊|隧道|入口|出口|洞|通道|门口|洞穴|地道|hole|door|hallway|corridor|gate|tunnel|entrance|exit|cave|portal|passage|knock|doorway',
  stairs:'楼梯|台阶|阶梯|梯子|爬楼|上楼|下楼|扶梯|攀登|stairs|staircase|stair|step|steps|ladder|upstairs|downstairs|escalator|climb|climbing',
  tree:'树|叶|枫|竹子|果树|树枝|种子|苹果|果实|水果|tree|leaf|leaves|branch|oak|pine|bamboo|fruit|apple|seed',
  forest:'森林|树林|丛林|山林|露营|野外|forest|woods|jungle|camp|camping|woodland',
  mountain:'山|悬崖|峰|峡谷|岩石|石头|高处|爬山|雪山|断崖|沙漠|洞窟|mountain|hill|cliff|peak|valley|canyon|summit|rock|slope|stone|desert',
  fire:'火焰|火光|火灾|大火|着火|烧|燃|爆炸|火山|岩浆|战争|炸弹|枪|硝烟|烟|愤怒|生气|恶魔|地狱|火柴|fire|burn|burning|flame|explosion|bomb|war|gun|shoot|smoke|lava|volcano|blast|angry|rage|devil|demon|hell',
  eye:'眼睛|眼神|眼球|眼珠|睁眼|盯|凝视|注视|窥|偷看|监视|目光|被看|看着我|看我|瞳孔|镜子|注意|eye|eyes|stare|gaze|watching|watched|spy|stalk|mirror|blind|observe',
  cat:'猫|宠物|cat|kitten|pet',
  elephant:'大象|白象|象牙|象群|elephant|ivory',
  horse:'马匹|白马|黑马|骏马|小马|骑马|赛马|马群|斑马|horse|pony|zebra|stallion|mare',
  tiger:'老虎|虎|猛虎|豹|猎豹|tiger|leopard|panther|cheetah',
  lion:'狮子|狮|lion',
  deer:'鹿|麋鹿|驯鹿|小鹿|羚羊|deer|elk|reindeer|stag|antler|antelope',
  rabbit:'兔子|兔|小兔|白兔|rabbit|bunny|hare',
  bear:'熊|熊猫|北极熊|黑熊|bear|panda|teddy',
  canine:'狗|小狗|狼|狐狸|野狼|犬|dog|puppy|wolf|fox|hound|jackal',
  beast:'奶牛|公牛|牛群|黄牛|水牛|小牛|斗牛|山羊|绵羊|羊群|小羊|猪|小猪|野猪|驴|骆驼|动物|野兽|怪物|巨兽|猛兽|animal|beast|monster|cow|sheep|goat|pig|donkey|camel|creature|bull',
  butterfly:'蝶|蜜蜂|蜻蜓|萤火虫|butterfly|moth|bee|mosquito|dragonfly|firefly|蝴蝶',
  flower:'花|向日葵|草地|草坪|花园|玫瑰|樱花|莲|草|稻田|麦田|田野|petal|sunflower|flower|rose|garden|bloom|tulip|lotus|grass|daisy|lily|meadow|blossom|field',
  snake:'蛇|龙|蟒|蜥蜴|鳄鱼|恐龙|毒|snake|dragon|serpent|lizard|crocodile|dinosaur|poison|venom',
  falling:'坠|掉|跌|摔|跳下|跳楼|跳崖|跳水|失重|悬空|崩塌|塌|沉下|失足|蹦极|fall|falling|fell|fallen|drop|dropped|jump|plunge|slip|collapse|tumble|bungee',
  road:'路|追|跑|逃|赶|车|公路|车站|高速|奔跑|迷路|迟到|错过|旅行|散步|步行|走路|远方|终点|旅途|road|walk|walking|path|chase|chasing|run|running|escape|highway|late|missed|travel|journey|trip|hurry|lost|traffic',
  city:'城|高楼|大楼|大厦|街|商场|商店|超市|广场|摩天|市区|办公室|公司|上班|工作|酒店|餐厅|银行|电影院|酒吧|city|building|street|town|mall|shop|store|office|work|company|skyscraper|downtown|market|hotel|restaurant|cafe|bank|cinema|bar|咖啡馆|咖啡店',
  paper:'考试|试卷|卷子|考场|作业|书|课|论文|作文|答题|毕业|成绩|不及格|交卷|演讲|报告|信|笔|exam|test|paper|homework|book|lecture|essay|thesis|deadline|grade|study|letter|diploma|speech|pen',
  person:'人|朋友|妈|爸|孩子|小孩|家人|奶奶|爷爷|外婆|外公|姐姐|哥哥|弟弟|妹妹|前任|爱人|恋人|男朋友|女朋友|老公|老婆|同事|老板|婴儿|老人|陌生人|我们|他们|警察|士兵|女孩|男孩|姑娘|歌手|演员|观众|person|friend|mother|father|family|child|girl|boy|someone|grandma|grandpa|sister|brother|ex|lover|boyfriend|girlfriend|husband|wife|boss|colleague|baby|stranger|crowd|people|shadow|everyone|police|soldier|kid|teenager|audience|singer|actor|逝去的亲人',
  heart:'爱心|心脏|心跳|心碎|爱情|恋爱|表白|亲吻|拥抱|思念|暗恋|love|heart|kiss|romance|hug|crush',
  clock:'时钟|钟表|钟|手表|时间|闹钟|倒计时|钟声|clock|watch|time|alarm|countdown|bell',
  key:'钥匙|锁|密码|key|keys|lock|password',
  boat:'船|舟|游艇|帆|划船|轮船|潜艇|boat|ship|sail|yacht|canoe|ferry|submarine|raft',
  bridge:'桥|天桥|大桥|吊桥|bridge',
  tower:'塔|灯塔|钟楼|城堡|高塔|tower|castle|lighthouse|spire|fortress',
  candle:'蜡烛|烛|灯|火把|手电筒|candle|lamp|lantern|torch|flashlight|bulb|蜡',
  umbrella:'伞|雨伞|撑伞|umbrella|parasol',
  feather:'羽毛|羽|feather|plume',
  crown:'皇冠|王冠|国王|女王|王子|公主|皇帝|皇后|宫殿|王位|king|queen|prince|princess|crown|throne|emperor|royal|palace',
  skull:'骷髅|头骨|骨头|死亡|死去|死了|尸体|坟墓|墓|棺材|葬礼|skull|bone|death|dead|corpse|grave|coffin|funeral|skeleton|tomb',
  hourglass:'沙漏|沙子|永恒|时光|岁月|hourglass|sand|eternity|forever',
  cup:'杯|水杯|茶杯|咖啡|cup|mug|teacup|goblet|coffee|tea',
  bottle:'瓶|酒瓶|药瓶|bottle|flask',
  bowl:'碗|盘子|碟子|餐盘|盆|餐具|bowl|plate|dish|saucer',
  kettle:'壶|锅|煲|kettle|teapot|pot|pan|cooking',
  jar:'罐|水缸|桶|jar|bucket|barrel|tin',
  box:'盒|箱|匣|礼物|包裹|快递|礼盒|box|crate|parcel|package|gift|present',
  bag:'书包|背包|手提包|袋|钱包|包|bag|backpack|handbag|purse|wallet|sack',
  suitcase:'行李箱|行李|旅行箱|suitcase|luggage|baggage',
  envelope:'信封|邮件|邮箱|信件|明信片|envelope|mail|postcard',
  phone:'手机|电话|座机|smartphone|phone|cellphone|telephone|mobile',
  laptop:'电脑|笔记本|键盘|鼠标|平板|laptop|computer|keyboard|tablet',
  tv:'电视|屏幕|显示器|投影|电影|tv|television|screen|monitor|movie',
  camera:'相机|摄像|摄影|镜头|拍照|camera|photograph|lens|selfie',
  chair:'椅|凳|座位|chair|stool|seat|bench',
  table:'桌|柜|书架|架子|table|desk|counter|shelf|cabinet|bookshelf|wardrobe',
  sofa:'沙发|床垫|被子|枕头|毯子|sofa|couch|pillow|blanket|mattress|cushion|quilt',
  shirt:'衣|衫|裤|服|羽绒服|毛衣|夹克|校服|制服|shirt|clothes|clothing|jacket|coat|pants|trousers|sweater|uniform|jeans',
  dress:'裙|婚纱|礼服|dress|gown|skirt',
  hat:'帽|头盔|发带|hat|cap|helmet|beanie',
  shoe:'鞋|靴|袜|拖鞋|shoe|shoes|boot|sock|sneaker|sandal|slipper',
  knife:'刀|剑|匕首|knife|sword|dagger|blade',
  hammer:'锤|斧|锄|铁锹|工具|tool|hammer|axe|shovel|wrench',
  scissors:'剪|剪刀|针线|缝纫|scissors|needle|thread|sewing',
  car:'汽车|轿车|货车|卡车|出租车|公交|大巴|开车|car|taxi|bus|truck|van|jeep|drive|driving',
  bicycle:'自行车|单车|摩托|脚踏车|bike|bicycle|motorcycle|scooter',
  ball:'足球|篮球|皮球|排球|网球|球场|球|ball|football|basketball|soccer|tennis|marble',
  egg:'鸡蛋|蛋壳|彩蛋|蛋|egg|eggs',
  coin:'钱|硬币|金币|金钱|财富|宝藏|coin|money|cash|dollar|treasure|rich',
  cake:'蛋糕|月饼|糕|饼|糖|甜点|生日|cake|cookie|dessert|candy|sweet|birthday|pie|pastry',
  bread:'面包|香蕉|西瓜|banana|馒头|食物|吃|饿|米饭|面条|肉|菜|汤|饺子|bread|food|rice|noodle|meat|eat|eating|hungry|dinner|lunch|breakfast|meal|pizza|burger|做饭',
  picture:'画|照片|相框|油画|海报|壁画|painting|picture|photo|frame|poster|portrait|artwork',
  piano:'琴|钢琴|乐器|piano|organ',
  guitar:'吉他|小提琴|琵琶|弦|guitar|violin|cello',
  note:'歌|唱|音乐|曲|旋律|音符|舞|song|sing|singing|music|melody|dance|dancing|concert',
  hand:'手指|手掌|拳头|握手|牵手|双手|右手|左手|手臂|伸手|fingers|fist|palm|handshake|hand|hands|手上|手心|手背|手腕',
  tooth:'牙|tooth|teeth|dentist',
  mouth:'嘴|嘴唇|唇|尖叫|大喊|喊叫|mouth|lips|scream|shout',
  foot:'脚|赤脚|腿|脚印|foot|feet|barefoot|footprint|leg|toe',
  gear:'机器|机械|齿轮|工厂|零件|电路|machine|machinery|gear|factory|engine|robot|motor',
  classroom:'教室|课堂|黑板|讲台|老师|同学|学校|上课|下课|校园|高中|初中|小学|大学|课桌|classroom|school|teacher|blackboard|lesson|classmate|class',
  hospital:'医院|病房|医生|护士|急诊|手术|打针|看病|住院|救护车|hospital|doctor|nurse|clinic|surgery|ambulance',
  train:'火车|地铁|列车|高铁|轻轨|站台|车厢|铁轨|train|subway|metro|railway|platform',
  plane:'飞机|航班|机场|登机|机舱|空姐|坠机|airplane|plane|aeroplane|flight|airport|jet',
  elevator:'电梯|升降机|elevator|lift',
  bed:'床|病床|床上|床边|卧室|bed|bedroom',
  ghost:'鬼|女鬼|幽灵|鬼魂|丧尸|僵尸|黑影|怨灵|鬼屋|ghost|zombie|zombies|phantom|haunted|wraith',
  insect:'虫|虫子|蜘蛛|蟑螂|蚂蚁|苍蝇|蚊子|蛆|蜈蚣|蝗虫|insect|insects|bug|bugs|spider|spiders|cockroach|ant|ants|maggot|centipede',
  swirl:'变化|旋转|循环|轮回|转变|眩晕|change|spin|cycle|transform|dizzy|dizziness'
};

/* how much a scene's keywords count when more than 3 scenes match (people words are very common, so they count less) */
const LEX_WEIGHT={person:.4};

/* when no keyword matches, draw these scenes for the detected emotion instead of a plain swirl */
/* (the old per-mood default scenes are gone: a dream with nothing recognisable now gets a three-card spread from the abstract deck, js/tarot.js) */

const rxOf=s=>new RegExp(s.split('|').sort((a,b)=>b.length-a.length).map(w=>/^[a-z]/i.test(w)?'\\b'+w+'(?:s|es|ing|ed)?\\b':w).join('|'),'ig');
const LEX_RX={};
for(const k in LEX)LEX_RX[k]=LEX[k]==='$^'?null:rxOf(LEX[k]);

/* object archetypes: in a compound word the LAST part names the kind of thing (草帽 is a hat, not grass; paper bag is a bag, not paper) */
const OBJ_SCENES=new Set('bed train plane elevator classroom hospital ghost insect cup bottle bowl kettle jar box bag suitcase envelope phone laptop tv camera chair table sofa shirt dress hat shoe knife hammer scissors car bicycle ball egg coin cake bread picture piano guitar note hand tooth mouth foot gear'.split(' '));

/* every scene that matches the text: how many hits, where the first hit is, which words hit */
function matchScenes(text){
  const out=[],spans=[];
  for(const k in LEX_RX){
    const rx=LEX_RX[k];if(!rx)continue;
    rx.lastIndex=0;const words=[];let first=-1,m;const tx=NOT_RX[k]?text.replace(NOT_RX[k],s=>' '.repeat(s.length)):text;
    while((m=rx.exec(tx))){if(first<0)first=m.index;if(!words.includes(m[0].toLowerCase()))words.push(m[0].toLowerCase());if(m[0]!=='')spans.push({k,s:m.index,e:m.index+m[0].length});if(m[0]==='')rx.lastIndex++;}
    if(words.length)out.push({name:k,first,words,score:words.length*(LEX_WEIGHT[k]||1)});
  }
  /* head rule: chains of touching hits (no gap, or one space) keep only the last one when it is an object */
  /* a hit inside a longer object word is part of it (剪刀 is scissors; the 刀 in it is not a knife) */
  for(let i=spans.length-1;i>=0;i--){const a=spans[i];
    if(spans.some(b=>b!==a&&b.k!==a.k&&OBJ_SCENES.has(b.k)&&b.s<=a.s&&b.e>=a.e&&b.e-b.s>a.e-a.s))spans.splice(i,1);}
  spans.sort((a,b)=>a.s-b.s||b.e-a.e);
  const drop=new Set();
  for(let i=0;i<spans.length;i++){
    let end=spans[i].e,run=[spans[i]];
    for(let j=i+1;j<spans.length;j++){const g=spans[j].s-end;if(g>=0&&g<=1&&(g===0||/\s/.test(text[end]))&&spans[j].k!==run[run.length-1].k){run.push(spans[j]);end=spans[j].e;}}
    const last=run[run.length-1];
    if(run.length>1&&OBJ_SCENES.has(last.k))run.slice(0,-1).forEach(r=>{if(r.k!==last.k)drop.add(r.k+'@'+r.s);});
  }
  return out.map(o=>{
    const own=spans.filter(x=>x.k===o.name),kept=own.filter(x=>!drop.has(x.k+'@'+x.s));
    if(own.length&&kept.length===own.length&&own.length===o.words.length)return o;
    if(!own.length)return null;
    if(!kept.length)return null;
    const words=[...new Set(kept.map(x=>text.slice(x.s,x.e).toLowerCase()))];
    return {name:o.name,first:kept[0].s,words,score:words.length*(LEX_WEIGHT[o.name]||1)};
  }).filter(Boolean);
}

/* choose up to 3 scenes: strongest first, then keep the order they appear in the dream */
function pickScenes(matches){
  let m=matches.slice().sort((a,b)=>b.score-a.score||a.first-b.first).slice(0,3);
  m.sort((a,b)=>a.first-b.first);
  let names=m.map(x=>x.name);
  if(names.includes('forest'))names=names.filter(n=>n!=='tree');
  return names;
}

/* compound words that contain a scene word by accident: removed from the text before that scene is matched */
const LEX_NOT={ball:'地球',bag:'面包|包子|包括|包装|包围',egg:'蛋糕',gear:'',cake:'蛋糕糕',tooth:'',coin:'钱包',sea:'水果',hand:'手机|手表|手术|手续|手艺|手套|手电',foot:'脚下|脚步'};
LEX_NOT.cake='';
const NOT_RX={};for(const k in LEX_NOT)if(LEX_NOT[k])NOT_RX[k]=new RegExp(LEX_NOT[k],'g');

/* abstract ideas: they have no shape of their own, so each is tied to a shape that behaves like it (documented in docs/lexicon-and-visuals.md) */
const CONCEPT={
  ripple:{why:'会扩散、会淡去',words:'记忆|回忆|过去|未来|遗忘|往事|回声|余音|memory|past|future|forget|echo|nostalgia|remember'},
  waves:{why:'会传播、起伏',words:'声音|噪音|寂静|沉默|信号|电波|谣言|传言|voice|sound|noise|silence|signal|whisper|rumou?r'},
  orbit:{why:'围绕与距离',words:'孤独|寂寞|孤单|分离|离别|距离|关系|陪伴|牵挂|lonely|loneliness|alone|distance|relationship|goodbye|separation'},
  burst:{why:'突然向外迸发',words:'快乐|幸福|兴奋|惊喜|庆祝|派对|烟花|力量|能量|冲击|happy|happiness|joy|excited|surprise|party|celebrate|firework|energy|power|shock'},
  pyramid:{why:'尖锐、层层逼近',words:'危险|恐惧|威胁|压力|噩梦|恐慌|害怕|焦虑|danger|threat|pressure|nightmare|fear|panic|terror|anxiety|afraid'},
  knot:{why:'缠绕、解不开',words:'秘密|谜|迷宫|复杂|混乱|纠结|矛盾|secret|mystery|maze|chaos|confus|tangled|puzzle'},
  crystal:{why:'透明、发光、易碎',words:'希望|梦想|灵魂|精神|纯洁|真相|美丽|愿望|hope|dream|soul|spirit|truth|pure|beauty|innocent'},
  drop:{why:'一点点汇聚、孕育',words:'生命|诞生|出生|成长|新生|孕育|悲伤|难过|伤心|life|birth|born|grow|growth|sorrow|sadness|grief'},
  halo:{why:'安宁、被照亮',words:'安宁|神圣|宁静|祝福|治愈|peace|peaceful|sacred|blessing|serene|healing'},
  phases:{why:'盈亏、等待',words:'等待|期待|盼望|反复|循环往复|waiting|anticipation|again and again'},
  constellation:{why:'相连、命运',words:'命运|缘分|注定|相遇|联系|宿命|fate|destiny|connection|encounter'},
  veil:{why:'遮蔽、朦胧',words:'模糊|朦胧|恍惚|看不清|迷雾|隐约|blurry|hazy|vague|unclear|veiled'},
  bloom:{why:'打开、生长',words:'温柔|心动|喜欢|暗恋|拥抱|tender|tenderness|affection|crush|hug|embrace'},
  shards:{why:'破碎、震惊',words:'破碎|崩溃|碎了|裂开|心碎|打碎|broken|shatter|shattered|crack|collapse|heartbreak'},
  cage:{why:'困住、出不去',words:'困住|被困|束缚|牢笼|逃不出|囚禁|出不去|trapped|stuck|cage|prison|confined|locked in'},
  spiral:{why:'卷入、失控',words:'漩涡|卷入|失控|疯狂|晕眩|vortex|whirl|madness|out of control'},
  mirror:{why:'另一个自己',words:'另一个我|另一个自己|倒影|分身|双胞胎|自我|镜子|reflection|twin|myself|doppelganger|mirror'},
  arch:{why:'将要跨过',words:'开始|入口|门槛|边界|转折|出发|beginning|threshold|entrance|border|turning point'},
  ascent:{why:'向上、挣脱',words:'升起|上升|飞升|超越|挣脱|rise|rising|ascend|transcend|break free'},
  descent:{why:'下沉、失去',words:'下沉|沉没|失落|堕落|沉沦|绝望|sink|sinking|drown|drowning|despair'},
  fan:{why:'展开、自由',words:'展开|解脱|释放|舒展|unfold|release|liberation|relief'},
  roots:{why:'来处、扎根',words:'故乡|老家|祖先|起源|归属|童年|hometown|ancestor|ancestors|roots|origin|belonging|childhood'},
  loop:{why:'一遍又一遍，回到原点',words:'一遍又一遍|重复|又回到|回到原点|无限循环|时间循环|倒着走|似曾相识|again and again|over and over|time loop|deja vu|déjà vu|backwards'},
  melt:{why:'融化、变形',words:'融化|溶化|化掉|变软|扭曲|变形|滴下来|melt|melting|melted|warped|distorted|dripping'},
  nest:{why:'越变越大或越变越小，没有尽头',words:'越变越大|越变越小|变大|变小|巨大的我|缩小|套娃|无穷无尽|层层|bigger and bigger|smaller and smaller|shrink|shrinking|giant|tiny|endless'},
  eyes:{why:'被看着',words:'被盯着|被看着|有人看|盯着我|监视|偷看|偷窥|无数双眼睛|watched|staring|stared|being watched|surveillance'},
  shadow:{why:'看不清的身影',words:'影子|身后|背后有人|阴影|看不清脸|没有脸|无脸|shadow|shadows|silhouette|faceless|someone behind'},
  crack:{why:'脚下裂开',words:'地震|裂缝|裂开|塌了|塌陷|崩塌|地陷|earthquake|crack|cracked|sinkhole|collapsed'},
  thorns:{why:'刺、疼',words:'刺|荆棘|扎|疼|痛|流血|血|thorn|thorns|pain|hurt|bleeding|blood'},
  dunes:{why:'空旷、荒芜',words:'荒原|荒野|空无一人|荒漠|一望无际|wasteland|empty|deserted|barren'},
  inversion:{why:'颠倒、反过来',words:'倒过来|颠倒|倒挂|上下颠倒|反过来|倒立|upside down|inverted|reversed|flipped'}
};
const CONCEPT_RX={};for(const k in CONCEPT)CONCEPT_RX[k]=rxOf(CONCEPT[k].words);
function conceptMatches(text){
  const out=[];
  for(const k in CONCEPT_RX){const rx=CONCEPT_RX[k];rx.lastIndex=0;let m;
    while((m=rx.exec(text))){out.push({fam:k,word:m[0],why:CONCEPT[k].why,first:m.index});if(m[0]==='')rx.lastIndex++;}}
  return out.sort((a,b)=>a.first-b.first);
}

/* tarot-style cards: an idea with no picture of its own is drawn as TWO existing pictures, and the pair carries the meaning
   (time = hourglass + moon: running out, in the night). [words, scene A, scene B, meaning] */
const COMBO=[
  ['时间|岁月|永恒|time|eternity','hourglass','moon','流逝，在夜里'],
  ['爱情|恋爱|爱人|相爱|love|romance','heart','flower','心，会开花'],
  ['死亡|葬礼|death|funeral|dying','skull','candle','终结，与余光'],
  ['去世的|过世的|已故|离世|死去的|deceased|late grandma|late grandpa','person','candle','逝去的人，与烛光'],
  ['自由|逃离|逃走|freedom|escape','fly','cloud','离开地面，没有边界'],
  ['战争|争吵|冲突|吵架|war|conflict|argument|fight','fire','knife','火与刃'],
  ['成功|胜利|成就|success|victory|triumph','crown','sun','加冕，在阳光下'],
  ['丢失|失去|失败|loss|lost|failure|failed','key','road','钥匙落在了路上'],
  ['背叛|欺骗|谎言|betray|betrayal|lie|lies|deceive','knife','heart','伤在心上'],
  ['生病|疾病|病痛|illness|disease|sick|sickness','rain','heart','心被淋湿'],
  ['婚礼|结婚|新娘|wedding|bride|marriage','dress','heart','礼服与心'],
  ['出生|婴儿|新生|诞生|birth|born|baby|newborn','egg','flower','孕育，然后绽开'],
  ['旅行|远方|流浪|travel|journey|wander|trip','suitcase','road','行李与路'],
  ['保护|安全|守护|避难|protect|safe|safety|shelter','umbrella','house','遮挡，与归处'],
  ['愤怒|生气|暴怒|anger|angry|rage|furious','fire','beast','火与兽'],
  ['选择|抉择|犹豫|choice|choose|decision|hesitate','road','door','岔路与门'],
  ['衰老|变老|老去|aging|elderly','hourglass','tree','年轮'],
  ['天堂|天国|heaven|paradise','stairs','cloud','向上的台阶，在云里'],
  ['地狱|深渊|hell|abyss','fire','stairs','向下的台阶，在火里'],
  ['魔法|奇迹|魔术|magic|miracle|wizard','stars','feather','轻盈的光'],
  ['友谊|朋友|友情|friend|friends|friendship','hand','heart','握住的手'],
  ['毕业|学位|graduation|graduate','hat','paper','帽子与证书'],
  ['加班|上班|工作|职场|work|office|overtime|career','laptop','clock','屏幕与时钟'],
  ['思念|想念|牵挂|miss you|longing|yearning','moon','envelope','夜里的一封信'],
  ['告别|再见|道别|farewell|goodbye|parting','hand','road','挥手，然后上路'],
  ['母亲|母爱|妈妈的爱|motherhood','heart','house','心与家'],
  ['财富|富有|发财|wealth|fortune','coin','crown','钱与冠'],
  ['战斗|竞争|比赛|compete|competition|battle|match','knife','crown','刃与冠']
];
const COMBO_RX=COMBO.map(c=>rxOf(c[0]));
function comboMatches(text){
  const out=[];
  COMBO.forEach((c,i)=>{const rx=COMBO_RX[i];rx.lastIndex=0;const m=rx.exec(text);
    if(m)out.push({word:m[0],a:c[1],b:c[2],why:c[3],first:m.index,kind:'combo'});});
  return out.sort((x,y)=>x.first-y.first);
}

/* typical dreams that are a situation rather than a thing (Nielsen et al. 2003, Typical Dreams Questionnaire): drawn as two pictures */
COMBO.push(
  ['迟到|来不及|赶不上|late for|running late|missed the','clock','road','时间在路上耗尽'],
  ['没复习|考不及格|挂科|考砸|不会做|failed the exam|unprepared','paper','clock','空白的卷子与时间'],
  ['前任|旧情|ex-boyfriend|ex-girlfriend|my ex','heart','shards','旧的心，碎了'],
  ['鬼压床|睡眠瘫痪|动不了|醒不过来|sleep paralysis|could not move','bed','ghost','床边的黑影'],
  ['裸体|没穿衣服|光着|naked|nude','person','eye','被所有人看着'],
  ['找不到厕所|厕所|卫生间|toilet|bathroom','door','card:knot','门后还是门'],
  ['掉牙|牙齿掉|牙掉|teeth falling|lost my teeth','tooth','falling','牙一颗颗掉落'],
  ['迷路|找不到路|走不出去|lost my way|got lost','road','card:knot','路缠成了结'],
  ['电梯坠|电梯掉|电梯失控|elevator fell|elevator dropped','elevator','falling','失控地下坠']
);
COMBO_RX.length=0;COMBO.forEach(c=>COMBO_RX.push(rxOf(c[0])));
