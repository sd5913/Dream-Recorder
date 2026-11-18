# Dream Recorder 完整词汇库与对应逻辑

截至 2026-11-12（第三轮）。所有表格由 `js/lexicon.js`、`js/emotion.js`、`js/symbols.js` 与 `js/scenes/*.js` 生成，和代码一致。

目录：一、画面库 · 二、日常物件 · 三、塔罗式组合 · 四、抽象图形牌（31 张）· 五、颜色词 · 六、情绪词与“抽牌” · 七、对应逻辑 · 八、测试与局限

匹配方式：中文词按子串，英文词按整词（允许 s、es、ing、ed）；同一场景里最长的词优先；一个梦最多画 3 个元素。

## 一、画面库：自然、场景、动物、图标

| 元素 | 名称 | 层 | 画面 | 关键词 |
| --- | --- | --- | --- | --- |
| sun | 太阳 | 天空 | 螺旋圆盘加放射光线 | 太阳、日出、日落、阳光、烈日、朝阳、晨光、夕阳、晴天、晴朗、炎热、暖阳、中午、白天、sun、sunrise、sunset、sunshine、sunny、dawn、daylight、summer、noon |
| moon | 月亮 | 天空 | 一弯新月 | 月亮、月光、月球、月夜、月圆、满月、弯月、明月、moon、moonlight、crescent、lunar |
| stars | 星空 | 天空 | 多颗放射状星芒 | 星、夜、太空、宇宙、银河、地球、行星、宇航员、黑夜、午夜、深夜、流星、许愿、魔法、外星、飞碟、火箭、night、star、midnight、galaxy、universe、space、planet、astronaut、evening、dark、meteor、wish、magic、alien、ufo、rocket |
| cloud | 云 | 天空 | 一团蓬松的云 | 云、雾、天空、雪、天际、阴天、天堂、漂浮、飘、裂开、光芒、霞、彩虹、大风、风吹、刮风、微风、狂风、cloud、sky、snow、fog、mist、heaven、float、floating、sunlight、rainbow、wind、windy、breeze、haze |
| rain | 雨 | 天空 | 乌云加斜雨线 | 雨、暴风、雷、闪电、台风、眼泪、流泪、哭、湿、淋、rain、storm、thunder、lightning、typhoon、tears、cry、crying、wet、drip、drizzle |
| sea | 海 | 地面 | 蓝色水平波浪带 | 海、湖、河、水、浪、洪、游泳、游过、游着、潜水、溺水、淹、池塘、瀑布、沙滩、沉没、岛、溪、泳池、sea、ocean、water、lake、river、swim、swimming、wave、flood、beach、dive、drown、pool、waterfall、tide、sink、bath、island、stream、pond、海啸、巨浪、大浪 |
| fish | 鱼 | 主体 | 鱼身加鱼尾和气泡 | 鱼、鲸、鲨、海豚、章鱼、水母、螃蟹、虾、钓鱼、鱼缸、鱼群、海底、dolphin、octopus、jellyfish、fish、whale、shark、crab、shrimp、aquarium、fishing、seafood、turtle、乌龟 |
| fly | 飞翔 | 主体 | 一对展开的翅膀 | 飞、翅、翼、鸟、翔、天使、风筝、气球、降落、起飞、滑翔、升空、直升机、降落伞、鹦鹉、鸽子、乌鸦、老鹰、鹰、天鹅、麻雀、燕子、海鸥、蝙蝠、凤凰、猫头鹰、fly、flying、bird、wing、flies、flew、aircraft、angel、kite、balloon、glide、soar、hover、helicopter、parachute、parrot、pigeon、crow、eagle、hawk、swan、sparrow、swallow、seagull、bat、phoenix、owl、dove |
| house | 房子 | 地面 | 红屋顶的小房子 | 房、屋、家里、回家、老家、我家、在家、公寓、阁楼、地下室、客厅、厨房、宿舍、窗、墙、屋顶、天花板、浴室、卫生间、厕所、搬家、house、home、room、dorm、kitchen、apartment、attic、basement、window、wall、roof、ceiling、living room、bathroom、toilet、floor |
| door | 门 | 主体 | 拱形门 | 门、走廊、隧道、入口、出口、洞、通道、门口、洞穴、地道、hole、door、hallway、corridor、gate、tunnel、entrance、exit、cave、portal、passage、knock、doorway |
| stairs | 楼梯 | 地面 | 向右上升的台阶 | 楼梯、台阶、阶梯、梯子、爬楼、上楼、下楼、扶梯、攀登、stairs、staircase、stair、step、steps、ladder、upstairs、downstairs、escalator、climb、climbing |
| tree | 树 | 主体 | 圆冠大树 | 树、叶、枫、竹子、果树、树枝、种子、苹果、果实、水果、tree、leaf、leaves、branch、oak、pine、bamboo、fruit、apple、seed |
| forest | 森林 | 地面 | 三棵树并排 | 森林、树林、丛林、山林、露营、野外、forest、woods、jungle、camp、camping、woodland |
| mountain | 山 | 地面 | 一大一小两座雪山 | 山、悬崖、峰、峡谷、岩石、石头、高处、爬山、雪山、断崖、沙漠、洞窟、mountain、hill、cliff、peak、valley、canyon、summit、rock、slope、stone、desert |
| fire | 火焰 | 主体 | 几团火苗 | 火焰、火光、火灾、大火、着火、烧、燃、爆炸、火山、岩浆、战争、炸弹、枪、硝烟、烟、愤怒、生气、恶魔、地狱、火柴、fire、burn、burning、flame、explosion、bomb、war、gun、shoot、smoke、lava、volcano、blast、angry、rage、devil、demon、hell |
| eye | 眼睛 | 主体 | 带睫毛的眼睛，彩色虹膜 | 眼睛、眼神、眼球、眼珠、睁眼、盯、凝视、注视、窥、偷看、监视、目光、被看、看着我、看我、瞳孔、镜子、注意、eye、eyes、stare、gaze、watching、watched、spy、stalk、mirror、blind、observe |
| cat | 猫 | 主体 | 猫脸加胡须 | 猫、宠物、cat、kitten、pet |
| elephant | 大象 | 主体 | 侧身大象：大耳朵、长鼻子、象牙 | 大象、白象、象牙、象群、elephant、ivory |
| horse | 马 | 主体 | 侧身马：长颈、鬃毛、尾巴 | 马匹、白马、黑马、骏马、小马、骑马、赛马、马群、斑马、horse、pony、zebra、stallion、mare |
| tiger | 老虎 | 主体 | 橙色身体加竖条纹 | 老虎、虎、猛虎、豹、猎豹、tiger、leopard、panther、cheetah |
| lion | 狮子 | 主体 | 身体加一圈圈鬃毛 | 狮子、狮、lion |
| deer | 鹿 | 主体 | 细腿加分叉的鹿角 | 鹿、麋鹿、驯鹿、小鹿、羚羊、deer、elk、reindeer、stag、antler、antelope |
| rabbit | 兔子 | 主体 | 坐姿兔子，长耳朵 | 兔子、兔、小兔、白兔、rabbit、bunny、hare |
| bear | 熊 | 主体 | 圆耳朵的粗壮大熊 | 熊、熊猫、北极熊、黑熊、bear、panda、teddy |
| canine | 狗 | 主体 | 尖耳朵、尖嘴的犬科 | 狗、小狗、狼、狐狸、野狼、犬、dog、puppy、wolf、fox、hound、jackal |
| beast | 兽 | 主体 | 通用四足动物（牛羊猪等） | 奶牛、公牛、牛群、黄牛、水牛、小牛、斗牛、山羊、绵羊、羊群、小羊、猪、小猪、野猪、驴、骆驼、动物、野兽、怪物、巨兽、猛兽、animal、beast、monster、cow、sheep、goat、pig、donkey、camel、creature、bull |
| butterfly | 蝴蝶 | 主体 | 紫色双翅 | 蝶、蜜蜂、蜻蜓、萤火虫、butterfly、moth、bee、mosquito、dragonfly、firefly、蝴蝶 |
| flower | 花 | 主体 | 向日葵 | 花、向日葵、草地、草坪、花园、玫瑰、樱花、莲、草、稻田、麦田、田野、petal、sunflower、flower、rose、garden、bloom、tulip、lotus、grass、daisy、lily、meadow、blossom、field |
| snake | 蛇 | 主体 | 弯曲的蛇身 | 蛇、龙、蟒、蜥蜴、鳄鱼、恐龙、毒、snake、dragon、serpent、lizard、crocodile、dinosaur、poison、venom |
| falling | 坠落 | 主体 | 竖线中的红色小人 | 坠、掉、跌、摔、跳下、跳楼、跳崖、跳水、失重、悬空、崩塌、塌、沉下、失足、蹦极、fall、falling、fell、fallen、drop、dropped、jump、plunge、slip、collapse、tumble、bungee |
| road | 路 | 地面 | 向远处收拢的道路 | 路、追、跑、逃、赶、车、公路、车站、高速、奔跑、迷路、迟到、错过、旅行、散步、步行、走路、远方、终点、旅途、road、walk、walking、path、chase、chasing、run、running、escape、highway、late、missed、travel、journey、trip、hurry、lost、traffic |
| city | 城市 | 地面 | 一排亮窗的楼房 | 城、高楼、大楼、大厦、街、商场、商店、超市、广场、摩天、市区、办公室、公司、上班、工作、酒店、餐厅、银行、电影院、酒吧、city、building、street、town、mall、shop、store、office、work、company、skyscraper、downtown、market、hotel、restaurant、cafe、bank、cinema、bar、咖啡馆、咖啡店 |
| paper | 试卷 | 主体 | 折角的纸 | 考试、试卷、卷子、考场、作业、书、课、论文、作文、答题、毕业、成绩、不及格、交卷、演讲、报告、信、笔、exam、test、paper、homework、book、lecture、essay、thesis、deadline、grade、study、letter、diploma、speech、pen |
| person | 人影 | 主体 | 人形剪影 | 人、朋友、妈、爸、孩子、小孩、家人、奶奶、爷爷、外婆、外公、姐姐、哥哥、弟弟、妹妹、前任、爱人、恋人、男朋友、女朋友、老公、老婆、同事、老板、婴儿、老人、陌生人、我们、他们、警察、士兵、女孩、男孩、姑娘、歌手、演员、观众、person、friend、mother、father、family、child、girl、boy、someone、grandma、grandpa、sister、brother、ex、lover、boyfriend、girlfriend、husband、wife、boss、colleague、baby、stranger、crowd、people、shadow、everyone、police、soldier、kid、teenager、audience、singer、actor、逝去的亲人 |
| heart | 心 | 主体 | 红色爱心，外圈一圈轮廓 | 爱心、心脏、心跳、心碎、爱情、恋爱、表白、亲吻、拥抱、思念、暗恋、love、heart、kiss、romance、hug、crush |
| clock | 钟 | 主体 | 圆形钟面、刻度和指针 | 时钟、钟表、钟、手表、时间、闹钟、倒计时、钟声、clock、watch、time、alarm、countdown、bell |
| key | 钥匙 | 主体 | 圆环加钥匙齿 | 钥匙、锁、密码、key、keys、lock、password |
| boat | 船 | 主体 | 船身、两张帆、下面的波浪 | 船、舟、游艇、帆、划船、轮船、潜艇、boat、ship、sail、yacht、canoe、ferry、submarine、raft |
| bridge | 桥 | 地面 | 带拱洞的石桥和栏杆 | 桥、天桥、大桥、吊桥、bridge |
| tower | 塔 | 主体 | 带尖顶和窗的高塔 | 塔、灯塔、钟楼、城堡、高塔、tower、castle、lighthouse、spire、fortress |
| candle | 蜡烛 | 主体 | 蜡烛、火苗和光晕 | 蜡烛、烛、灯、火把、手电筒、candle、lamp、lantern、torch、flashlight、bulb、蜡 |
| umbrella | 伞 | 主体 | 彩色伞面、伞骨和伞柄 | 伞、雨伞、撑伞、umbrella、parasol |
| feather | 羽毛 | 主体 | 一片斜放的羽毛 | 羽毛、羽、feather、plume |
| crown | 王冠 | 主体 | 金色王冠和宝石 | 皇冠、王冠、国王、女王、王子、公主、皇帝、皇后、宫殿、王位、king、queen、prince、princess、crown、throne、emperor、royal、palace |
| skull | 骷髅 | 主体 | 头骨、眼窝、牙齿 | 骷髅、头骨、骨头、死亡、死去、死了、尸体、坟墓、墓、棺材、葬礼、skull、bone、death、dead、corpse、grave、coffin、funeral、skeleton、tomb |
| hourglass | 沙漏 | 主体 | 上下两个三角和上下横梁 | 沙漏、沙子、永恒、时光、岁月、hourglass、sand、eternity、forever |
| classroom | 教室 | 地面 | 黑板加三张课桌 | 教室、课堂、黑板、讲台、老师、同学、学校、上课、下课、校园、高中、初中、小学、大学、课桌、classroom、school、teacher、blackboard、lesson、classmate、class |
| hospital | 医院 | 地面 | 楼房，窗户，楼顶红十字 | 医院、病房、医生、护士、急诊、手术、打针、看病、住院、救护车、hospital、doctor、nurse、clinic、surgery、ambulance |
| train | 火车 | 主体 | 车厢、车窗、车轮和铁轨 | 火车、地铁、列车、高铁、轻轨、站台、车厢、铁轨、train、subway、metro、railway、platform |
| plane | 飞机 | 主体 | 侧面的客机，机翼和尾翼 | 飞机、航班、机场、登机、机舱、空姐、坠机、airplane、plane、aeroplane、flight、airport、jet |
| elevator | 电梯 | 主体 | 两扇电梯门，上下箭头 | 电梯、升降机、elevator、lift |
| bed | 床 | 主体 | 床头、枕头和被子 | 床、病床、床上、床边、卧室、bed、bedroom |
| ghost | 鬼影 | 主体 | 披着布的鬼影，黑洞洞的眼和嘴 | 鬼、女鬼、幽灵、鬼魂、丧尸、僵尸、黑影、怨灵、鬼屋、ghost、zombie、zombies、phantom、haunted、wraith |
| insect | 虫子 | 主体 | 多足的虫子，长触角，红眼睛 | 虫、虫子、蜘蛛、蟑螂、蚂蚁、苍蝇、蚊子、蛆、蜈蚣、蝗虫、insect、insects、bug、bugs、spider、spiders、cockroach、ant、ants、maggot、centipede |

上面最后 8 行（教室、医院、火车、飞机、电梯、床、鬼影、虫子）是按“常见梦境类型”补的，依据见 `docs/dream-types.md`。

## 二、日常物件原型

复合词看**最后一部分**判断是什么东西（保温杯 → 杯子，`paper bag` → 袋子）。

| 元素 | 名称 | 层 | 画面 | 关键词（含词尾字） |
| --- | --- | --- | --- | --- |
| cup | 杯子 | 主体 | 带把手、冒热气的杯子 | 杯、水杯、茶杯、咖啡、cup、mug、teacup、goblet、coffee、tea |
| bottle | 瓶子 | 主体 | 细颈玻璃瓶，中间一圈标签 | 瓶、酒瓶、药瓶、bottle、flask |
| bowl | 碗盘 | 主体 | 半圆碗口加碗底 | 碗、盘子、碟子、餐盘、盆、餐具、bowl、plate、dish、saucer |
| kettle | 壶锅 | 主体 | 圆肚壶，有壶嘴、壶把和盖 | 壶、锅、煲、kettle、teapot、pot、pan、cooking |
| jar | 罐桶 | 主体 | 圆柱罐，带盖和两道横纹 | 罐、水缸、桶、jar、bucket、barrel、tin |
| box | 盒子 | 主体 | 立方盒，盖上有绑带 | 盒、箱、匣、礼物、包裹、快递、礼盒、box、crate、parcel、package、gift、present |
| bag | 包袋 | 主体 | 手提包，提手加搭扣 | 书包、背包、手提包、袋、钱包、包、bag、backpack、handbag、purse、wallet、sack |
| suitcase | 行李箱 | 主体 | 带提手和两道绑带的箱子 | 行李箱、行李、旅行箱、suitcase、luggage、baggage |
| envelope | 信封 | 主体 | 信封，封口三角加红色封蜡 | 信封、邮件、邮箱、信件、明信片、envelope、mail、postcard |
| phone | 手机 | 主体 | 竖屏手机，屏幕渐变 | 手机、电话、座机、smartphone、phone、cellphone、telephone、mobile |
| laptop | 电脑 | 主体 | 翻开的笔记本电脑 | 电脑、笔记本、键盘、鼠标、平板、laptop、computer、keyboard、tablet |
| tv | 电视屏幕 | 主体 | 旧式电视，两根天线 | 电视、屏幕、显示器、投影、电影、tv、television、screen、monitor、movie |
| camera | 相机 | 主体 | 相机，镜头和闪光点 | 相机、摄像、摄影、镜头、拍照、camera、photograph、lens、selfie |
| chair | 椅子 | 主体 | 带靠背的椅子 | 椅、凳、座位、chair、stool、seat、bench |
| table | 桌子 | 主体 | 桌面加四条腿 | 桌、柜、书架、架子、table、desk、counter、shelf、cabinet、bookshelf、wardrobe |
| sofa | 沙发被褥 | 主体 | 双扶手沙发 | 沙发、床垫、被子、枕头、毯子、sofa、couch、pillow、blanket、mattress、cushion、quilt |
| shirt | 衣服 | 主体 | 短袖衣服，带领口 | 衣、衫、裤、服、羽绒服、毛衣、夹克、校服、制服、shirt、clothes、clothing、jacket、coat、pants、trousers、sweater、uniform、jeans |
| dress | 裙子 | 主体 | 收腰长裙 | 裙、婚纱、礼服、dress、gown、skirt |
| hat | 帽子 | 主体 | 圆顶帽加帽檐 | 帽、头盔、发带、hat、cap、helmet、beanie |
| shoe | 鞋 | 主体 | 一只运动鞋 | 鞋、靴、袜、拖鞋、shoe、shoes、boot、sock、sneaker、sandal、slipper |
| knife | 刀剑 | 主体 | 直刃刀，带护手和握柄 | 刀、剑、匕首、knife、sword、dagger、blade |
| hammer | 锤斧工具 | 主体 | 锤头加长柄 | 锤、斧、锄、铁锹、工具、tool、hammer、axe、shovel、wrench |
| scissors | 剪刀 | 主体 | 交叉刀片加两个圆环 | 剪、剪刀、针线、缝纫、scissors、needle、thread、sewing |
| car | 汽车 | 主体 | 侧面小汽车，两只轮子 | 汽车、轿车、货车、卡车、出租车、公交、大巴、开车、car、taxi、bus、truck、van、jeep、drive、driving |
| bicycle | 自行车 | 主体 | 两个轮子加车架 | 自行车、单车、摩托、脚踏车、bike、bicycle、motorcycle、scooter |
| ball | 球 | 主体 | 圆球，带接缝线 | 足球、篮球、皮球、排球、网球、球场、球、ball、football、basketball、soccer、tennis、marble |
| egg | 蛋 | 主体 | 椭圆蛋 | 鸡蛋、蛋壳、彩蛋、蛋、egg、eggs |
| coin | 钱币 | 主体 | 圆形硬币，中间有符号 | 钱、硬币、金币、金钱、财富、宝藏、coin、money、cash、dollar、treasure、rich |
| cake | 蛋糕甜点 | 主体 | 带蜡烛的蛋糕 | 蛋糕、月饼、糕、饼、糖、甜点、生日、cake、cookie、dessert、candy、sweet、birthday、pie、pastry |
| bread | 食物 | 主体 | 半圆面包，表面划痕 | 面包、香蕉、西瓜、banana、馒头、食物、吃、饿、米饭、面条、肉、菜、汤、饺子、bread、food、rice、noodle、meat、eat、eating、hungry、dinner、lunch、breakfast、meal、pizza、burger、做饭 |
| picture | 画框 | 主体 | 画框里有山和太阳 | 画、照片、相框、油画、海报、壁画、painting、picture、photo、frame、poster、portrait、artwork |
| piano | 琴 | 主体 | 一排琴键 | 琴、钢琴、乐器、piano、organ |
| guitar | 吉他提琴 | 主体 | 吉他，琴箱加琴颈 | 吉他、小提琴、琵琶、弦、guitar、violin、cello |
| note | 音乐歌舞 | 主体 | 连在一起的两个音符 | 歌、唱、音乐、曲、旋律、音符、舞、song、sing、singing、music、melody、dance、dancing、concert |
| hand | 手 | 主体 | 五指张开的手 | 手指、手掌、拳头、握手、牵手、双手、右手、左手、手臂、伸手、fingers、fist、palm、handshake、hand、hands、手上、手心、手背、手腕 |
| tooth | 牙 | 主体 | 一颗牙，两个牙根 | 牙、tooth、teeth、dentist |
| mouth | 嘴 | 主体 | 张开的嘴，带牙齿 | 嘴、嘴唇、唇、尖叫、大喊、喊叫、mouth、lips、scream、shout |
| foot | 脚 | 主体 | 脚掌与脚趾 | 脚、赤脚、腿、脚印、foot、feet、barefoot、footprint、leg、toe |
| gear | 机械 | 主体 | 带齿的齿轮 | 机器、机械、齿轮、工厂、零件、电路、machine、machinery、gear、factory、engine、robot、motor |

排除的假复合词（`LEX_NOT`）：面包不是“包”，包子/包括/包装/包围不是“包”，地球不是“球”，蛋糕不是“蛋”，脚下/脚步不是“脚”。

## 三、塔罗式组合（COMBO）

像塔罗牌：一张牌的含义来自画面里几个符号叠加。抽象词没有自己的形状时，用两个已有意象来表达，组合本身就是解释。画面里会同时出现这两个意象，下方写“（组合：…）”。

规则：
- 两个意象需要同时有位置（一幅画最多 3 个）；放不下就跳过，不会只画一半。
- 词库里原本就因这个词命中的场景会让位给组合（时间原来只画钟，现在是沙漏 + 月亮）。

| 词 | 画成 | 含义 |
| --- | --- | --- |
| 时间 · 岁月 · 永恒 · time · eternity | 沙漏 + 月亮 | 流逝，在夜里 |
| 爱情 · 恋爱 · 爱人 · 相爱 · love · romance | 心 + 花 | 心，会开花 |
| 死亡 · 葬礼 · death · funeral · dying | 骷髅 + 蜡烛 | 终结，与余光 |
| 去世的 · 过世的 · 已故 · 离世 · 死去的 · deceased · late grandma · late grandpa | 人影 + 蜡烛 | 逝去的人，与烛光 |
| 自由 · 逃离 · 逃走 · freedom · escape | 飞翔 + 云 | 离开地面，没有边界 |
| 战争 · 争吵 · 冲突 · 吵架 · war · conflict · argument · fight | 火焰 + 刀剑 | 火与刃 |
| 成功 · 胜利 · 成就 · success · victory · triumph | 王冠 + 太阳 | 加冕，在阳光下 |
| 丢失 · 失去 · 失败 · loss · lost · failure · failed | 钥匙 + 路 | 钥匙落在了路上 |
| 背叛 · 欺骗 · 谎言 · betray · betrayal · lie · lies · deceive | 刀剑 + 心 | 伤在心上 |
| 生病 · 疾病 · 病痛 · illness · disease · sick · sickness | 雨 + 心 | 心被淋湿 |
| 婚礼 · 结婚 · 新娘 · wedding · bride · marriage | 裙子 + 心 | 礼服与心 |
| 出生 · 婴儿 · 新生 · 诞生 · birth · born · baby · newborn | 蛋 + 花 | 孕育，然后绽开 |
| 旅行 · 远方 · 流浪 · travel · journey · wander · trip | 行李箱 + 路 | 行李与路 |
| 保护 · 安全 · 守护 · 避难 · protect · safe · safety · shelter | 伞 + 房子 | 遮挡，与归处 |
| 愤怒 · 生气 · 暴怒 · anger · angry · rage · furious | 火焰 + 兽 | 火与兽 |
| 选择 · 抉择 · 犹豫 · choice · choose · decision · hesitate | 路 + 门 | 岔路与门 |
| 衰老 · 变老 · 老去 · aging · elderly | 沙漏 + 树 | 年轮 |
| 天堂 · 天国 · heaven · paradise | 楼梯 + 云 | 向上的台阶，在云里 |
| 地狱 · 深渊 · hell · abyss | 火焰 + 楼梯 | 向下的台阶，在火里 |
| 魔法 · 奇迹 · 魔术 · magic · miracle · wizard | 星空 + 羽毛 | 轻盈的光 |
| 友谊 · 朋友 · 友情 · friend · friends · friendship | 手 + 心 | 握住的手 |
| 毕业 · 学位 · graduation · graduate | 帽子 + 试卷 | 帽子与证书 |
| 加班 · 上班 · 工作 · 职场 · work · office · overtime · career | 电脑 + 钟 | 屏幕与时钟 |
| 思念 · 想念 · 牵挂 · miss you · longing · yearning | 月亮 + 信封 | 夜里的一封信 |
| 告别 · 再见 · 道别 · farewell · goodbye · parting | 手 + 路 | 挥手，然后上路 |
| 母亲 · 母爱 · 妈妈的爱 · motherhood | 心 + 房子 | 心与家 |
| 财富 · 富有 · 发财 · wealth · fortune | 钱币 + 王冠 | 钱与冠 |
| 战斗 · 竞争 · 比赛 · compete · competition · battle · match | 刀剑 + 王冠 | 刃与冠 |
| 迟到 · 来不及 · 赶不上 · late for · running late · missed the | 钟 + 路 | 时间在路上耗尽 |
| 没复习 · 考不及格 · 挂科 · 考砸 · 不会做 · failed the exam · unprepared | 试卷 + 钟 | 空白的卷子与时间 |
| 前任 · 旧情 · ex-boyfriend · ex-girlfriend · my ex | 心 + shards | 旧的心，碎了 |
| 鬼压床 · 睡眠瘫痪 · 动不了 · 醒不过来 · sleep paralysis · could not move | 床 + 鬼影 | 床边的黑影 |
| 裸体 · 没穿衣服 · 光着 · naked · nude | 人影 + 眼睛 | 被所有人看着 |
| 找不到厕所 · 厕所 · 卫生间 · toilet · bathroom | 门 + 图形牌「绳结」 | 门后还是门 |
| 掉牙 · 牙齿掉 · 牙掉 · teeth falling · lost my teeth | 牙 + 坠落 | 牙一颗颗掉落 |
| 迷路 · 找不到路 · 走不出去 · lost my way · got lost | 路 + 图形牌「绳结」 | 路缠成了结 |
| 电梯坠 · 电梯掉 · 电梯失控 · elevator fell · elevator dropped | 电梯 + 坠落 | 失控地下坠 |


## 四、抽象图形牌（31 张）

像一副塔罗牌：每张牌是一个抽象图形，有自己的含义。现在共 31 张（天 7、心 18、地 6）；标“新”的 9 张是按常见梦境类型补的：循环、融化、无尽、倒悬（超现实），黑影、眼睛、裂缝、荆棘（恐怖），沙丘（空旷）。它们在两种情况下出场：
- **抽象词**：词表里的抽象词（最后一栏）直接对应那张牌，比如“记忆”是涟漪，“被困”是牢笼。
- **完全对应不上的梦**：按情绪“抽牌”，见第六节。

每张牌有三个属性，都是我们定的约定，不是客观事实：
- **层**：天（悬在上方）、心（站在中间）、地（铺在下面）。三张牌各占一层，合起来是一幅画，而不是三块拼贴。
- **激烈度**：0 是静止，1 是剧烈。
- **情绪亲和度**：0 到 1，表示这个图形多适合表达某种情绪。下表列出最高的两种。

| 牌 | 层 | 激烈度 | 最适合的情绪 | 含义 | 直接对应的抽象词 |
| --- | --- | --- | --- | --- | --- |
| 光晕 (`halo`) | 天 | 静 (0.15) | 平静 1 · 喜悦 0.6 | 安宁、被照亮 | 安宁 · 神圣 · 宁静 · 祝福 · 治愈 · peace · peaceful · sacred · blessing · serene · healing |
| 月相 (`phases`) | 天 | 缓 (0.3) | 怀念 0.9 · 平静 0.6 | 盈亏、等待 | 等待 · 期待 · 盼望 · 反复 · 循环往复 · waiting · anticipation · again and again |
| 星座 (`constellation`) | 天 | 缓 (0.35) | 怀念 0.7 · 平静 0.5 | 相连、命运 | 命运 · 缘分 · 注定 · 相遇 · 联系 · 宿命 · fate · destiny · connection · encounter |
| 轨道 (`orbit`) | 天 | 缓 (0.4) | 悲伤 0.7 · 怀念 0.6 | 围绕与距离 | 孤独 · 寂寞 · 孤单 · 分离 · 离别 · 距离 · 关系 · 陪伴 · 牵挂 · lonely · loneliness · alone · distance · relationship · goodbye · separation |
| 帷幕 (`veil`) | 天 | 静 (0.25) | 奇异 0.8 · 悲伤 0.5 | 遮蔽、朦胧 | 模糊 · 朦胧 · 恍惚 · 看不清 · 迷雾 · 隐约 · blurry · hazy · vague · unclear · veiled |
| 水晶 (`crystal`) | 心 | 缓 (0.4) | 平静 0.6 · 喜悦 0.6 | 透明、发光、易碎 | 希望 · 梦想 · 灵魂 · 精神 · 纯洁 · 真相 · 美丽 · 愿望 · hope · dream · soul · spirit · truth · pure · beauty · innocent |
| 绽放 (`bloom`) | 心 | 动 (0.6) | 喜悦 1 · 平静 0.4 | 打开、生长 | 温柔 · 心动 · 喜欢 · 暗恋 · 拥抱 · tender · tenderness · affection · crush · hug · embrace |
| 迸发 (`burst`) | 心 | 烈 (1) | 喜悦 1 · 恐惧 0.4 | 突然向外迸发 | 快乐 · 幸福 · 兴奋 · 惊喜 · 庆祝 · 派对 · 烟花 · 力量 · 能量 · 冲击 · happy · happiness · joy · excited · surprise · party · celebrate · firework · energy · power · shock |
| 水滴 (`drop`) | 心 | 静 (0.2) | 悲伤 1 · 怀念 0.5 | 一点点汇聚、孕育 | 生命 · 诞生 · 出生 · 成长 · 新生 · 孕育 · 悲伤 · 难过 · 伤心 · life · birth · born · grow · growth · sorrow · sadness · grief |
| 尖塔 (`pyramid`) | 心 | 动 (0.7) | 恐惧 1 · 奇异 0.4 | 尖锐、层层逼近 | 危险 · 恐惧 · 威胁 · 压力 · 噩梦 · 恐慌 · 害怕 · 焦虑 · danger · threat · pressure · nightmare · fear · panic · terror · anxiety · afraid |
| 碎片 (`shards`) | 心 | 烈 (0.9) | 恐惧 0.8 · 悲伤 0.6 | 破碎、震惊 | 破碎 · 崩溃 · 碎了 · 裂开 · 心碎 · 打碎 · broken · shatter · shattered · crack · collapse · heartbreak |
| 牢笼 (`cage`) | 心 | 缓 (0.5) | 恐惧 0.8 · 悲伤 0.5 | 困住、出不去 | 困住 · 被困 · 束缚 · 牢笼 · 逃不出 · 囚禁 · 出不去 · trapped · stuck · cage · prison · confined · locked in |
| 绳结 (`knot`) | 心 | 缓 (0.5) | 奇异 0.9 · 恐惧 0.4 | 缠绕、解不开 | 秘密 · 谜 · 迷宫 · 复杂 · 混乱 · 纠结 · 矛盾 · secret · mystery · maze · chaos · confus · tangled · puzzle |
| 漩涡 (`spiral`) | 心 | 烈 (0.8) | 奇异 1 · 恐惧 0.5 | 卷入、失控 | 漩涡 · 卷入 · 失控 · 疯狂 · 晕眩 · vortex · whirl · madness · out of control |
| 镜像 (`mirror`) | 心 | 缓 (0.3) | 奇异 1 · 平静 0.3 | 另一个自己 | 另一个我 · 另一个自己 · 倒影 · 分身 · 双胞胎 · 自我 · 镜子 · reflection · twin · myself · doppelganger · mirror |
| 门槛 (`arch`) | 心 | 缓 (0.4) | 奇异 0.5 · 怀念 0.4 | 将要跨过 | 开始 · 入口 · 门槛 · 边界 · 转折 · 出发 · beginning · threshold · entrance · border · turning point |
| 上升 (`ascent`) | 心 | 动 (0.7) | 喜悦 0.8 · 奇异 0.3 | 向上、挣脱 | 升起 · 上升 · 飞升 · 超越 · 挣脱 · rise · rising · ascend · transcend · break free |
| 下沉 (`descent`) | 心 | 动 (0.75) | 恐惧 0.8 · 悲伤 0.8 | 下沉、失去 | 下沉 · 沉没 · 失落 · 堕落 · 沉沦 · 绝望 · sink · sinking · drown · drowning · despair |
| 展翼 (`fan`) | 心 | 动 (0.7) | 喜悦 0.9 · 平静 0.3 | 展开、自由 | 展开 · 解脱 · 释放 · 舒展 · unfold · release · liberation · relief |
| 声波 (`waves`) | 地 | 缓 (0.5) | 平静 0.5 · 奇异 0.4 | 会传播、起伏 | 声音 · 噪音 · 寂静 · 沉默 · 信号 · 电波 · 谣言 · 传言 · voice · sound · noise · silence · signal · whisper · rumou?r |
| 涟漪 (`ripple`) | 地 | 静 (0.2) | 怀念 1 · 平静 0.7 | 会扩散、会淡去 | 记忆 · 回忆 · 过去 · 未来 · 遗忘 · 往事 · 回声 · 余音 · memory · past · future · forget · echo · nostalgia · remember |
| 根系 (`roots`) | 地 | 静 (0.2) | 怀念 1 · 平静 0.4 | 来处、扎根 | 故乡 · 老家 · 祖先 · 起源 · 归属 · 童年 · hometown · ancestor · ancestors · roots · origin · belonging · childhood |
| 循环 (`loop`) 新 | 心 | 缓 (0.45) | 奇异 1 · 怀念 0.6 | 一遍又一遍，回到原点 | 一遍又一遍 · 重复 · 又回到 · 回到原点 · 无限循环 · 时间循环 · 倒着走 · 似曾相识 · again and again · over and over · time loop · deja vu · déjà vu · backwards |
| 融化 (`melt`) 新 | 心 | 缓 (0.4) | 奇异 0.9 · 悲伤 0.5 | 融化、变形 | 融化 · 溶化 · 化掉 · 变软 · 扭曲 · 变形 · 滴下来 · melt · melting · melted · warped · distorted · dripping |
| 无尽 (`nest`) 新 | 心 | 缓 (0.35) | 奇异 0.9 · 恐惧 0.3 | 越变越大或越变越小，没有尽头 | 越变越大 · 越变越小 · 变大 · 变小 · 巨大的我 · 缩小 · 套娃 · 无穷无尽 · 层层 · bigger and bigger · smaller and smaller · shrink · shrinking · giant · tiny · endless |
| 黑影 (`shadow`) 新 | 心 | 缓 (0.5) | 恐惧 1 · 奇异 0.6 | 看不清的身影 | 影子 · 身后 · 背后有人 · 阴影 · 看不清脸 · 没有脸 · 无脸 · shadow · shadows · silhouette · faceless · someone behind |
| 眼睛 (`eyes`) 新 | 天 | 缓 (0.5) | 恐惧 1 · 奇异 0.7 | 被看着 | 被盯着 · 被看着 · 有人看 · 盯着我 · 监视 · 偷看 · 偷窥 · 无数双眼睛 · watched · staring · stared · being watched · surveillance |
| 倒悬 (`inversion`) 新 | 天 | 缓 (0.45) | 奇异 1 · 恐惧 0.3 | 颠倒、反过来 | 倒过来 · 颠倒 · 倒挂 · 上下颠倒 · 反过来 · 倒立 · upside down · inverted · reversed · flipped |
| 裂缝 (`crack`) 新 | 地 | 烈 (0.85) | 恐惧 0.9 · 悲伤 0.4 | 脚下裂开 | 地震 · 裂缝 · 裂开 · 塌了 · 塌陷 · 崩塌 · 地陷 · earthquake · crack · cracked · sinkhole · collapsed |
| 荆棘 (`thorns`) 新 | 地 | 动 (0.6) | 恐惧 0.8 · 悲伤 0.7 | 刺、疼 | 刺 · 荆棘 · 扎 · 疼 · 痛 · 流血 · 血 · thorn · thorns · pain · hurt · bleeding · blood |
| 沙丘 (`dunes`) 新 | 地 | 静 (0.15) | 平静 0.6 · 悲伤 0.6 | 空旷、荒芜 | 荒原 · 荒野 · 空无一人 · 荒漠 · 一望无际 · wasteland · empty · deserted · barren |

完整的六种情绪亲和度在 `js/tarot.js` 的 `DECK` 表里。

## 五、颜色词（改变整幅画的颜色）

白象就是白色的象。颜色只影响画面里的图形，散落字不受影响。

| 词 | 效果 |
| --- | --- |
| 白、white、snowy white | h:210,s:.1,l:14 |
| 漆黑、黑色、黑、black | s:.25,l:-22 |
| 红、red、crimson | h:355,s:1.1,l:0 |
| 蓝、blue | h:215,s:1,l:0 |
| 绿、green | h:135,s:1,l:0 |
| 紫、purple、violet | h:280,s:1,l:0 |
| 粉、pink | h:330,s:.9,l:8 |
| 金色、金黄、golden、gold\b | h:42,s:1,l:4 |
| 银色、银白、silver | h:210,s:.15,l:14 |
| 橙、orange | h:24,s:1,l:0 |
| 灰色、灰、gr[ae]y | s:.12,l:0 |

## 六、情绪词与“抽牌”

情绪决定颜色、晃动和声音；数得最多的情绪胜出，没有就是平静。

| 情绪 | 词 |
| --- | --- |
| 恐惧 (`fear`) | 怕、恐、吓、惊、追、逃、坠、掉、噩梦、尖叫、fear、scar、afraid、nightmare、chase、falling、terror、困住、被困、出不去、逃不掉、trapped、鬼、黑影、丧尸、僵尸、动不了、蜘蛛、虫子、血、怪物、没复习、迟到、来不及、ghost、zombie、monster、spider、blood、late |
| 喜悦 (`joy`) | 开心、快乐、笑、幸福、兴奋、自由、happy、joy、fun、laugh、free |
| 悲伤 (`sad`) | 哭、悲、伤、难过、孤独、失去、死、去世、sad、cry、lonely、loss、grief |
| 怀念 (`nostalgia`) | 想念、怀念、小时候、童年、以前、过去、老家、miss、childhood、nostalg、old home |
| 奇异 (`strange`) | 奇怪、怪、诡、变成、消失、不对、weird、strange、odd、surreal、disappear、倒着、融化、颠倒、倒过来、越变越、变成了、两个月亮、melt、upside down |
| 平静 (`calm`) | 平静、安静、宁静、温柔、慢慢、calm、quiet、peace、gentle、slow |

**完全对应不上的时候**（没有画面词、没有组合牌），就像塔罗占卜一样读出梦的情绪，再抽三张牌：

1. **读情绪**：
   - 主情绪：画面上显示的那个，自动识别或用户自己选。
   - 次情绪：文字里第二多的情绪词。
   - 激烈度：动作词（跑、追、爆炸、突然、感叹号……）减去静止词（慢慢、躺、安静、雾、飘……），换算成 0 到 1。
2. **给每张牌打分**：
   - 主情绪亲和度 × 1
   - \+ 次情绪亲和度 × 0.45
   - − 激烈度差 × 0.6
   - \+ 一点点“运气”：由梦的文字决定，所以同一个梦每次抽到同样的牌，同一种情绪的不同梦又不会都一样。
3. **按位置抽三张**：天一张、心一张、地一张，各取那一层分数最高、而且没用过的牌。
4. **有依据时先固定**：梦里如果有抽象词（比如“被困”），它对应的牌直接占住自己那一层，其他两层再抽。
5. **有不认识的名词时**（比如“量子”），把它写在“心”那张牌上，画面下方显示“量子（按情绪抽到：漩涡，卷入、失控）”。
6. **画面下方的说明**写明读到的情绪和激烈度，例如“没认出具体的东西，按情绪抽了三张牌（恐惧，激烈）”。

例子：
- 一个害怕、激烈、全是不认识的词的梦，常抽到：帷幕（天）+ 尖塔或碎片（心）+ 声波（地）。
- 一个平静、缓慢的梦，常抽到：光晕 + 水晶 + 涟漪。
- 一个怀念的梦，常抽到：月相或星座 + 绽放或水滴 + 根系或涟漪。

## 七、对应逻辑

### 0. 总原则

1. **每一步都要有依据**，并且在画面下方的“识别到：…”里说明用了哪一步。
2. 越具体的依据越优先：词典里直接有 > 物件词尾 > 塔罗式组合 > 抽象词对应的图形牌 > 按情绪抽牌。
3. 一幅画最多 3 个意象。意象放不下时，抽象词就不画，宁可少画也不乱画。
4. 没有依据的词不假装“懂了”：它按情绪得到一张牌，画面下方写明“按情绪抽到”，并写进缺失日志，留给团队补词库。

### 1. 流程

```
梦的文字
  │
  ├─ ① 词库匹配（46 个场景 + 39 个物件原型，中文子串 / 英文整词）
  │     └─ 同一复合词里，取最后一个命中（词尾规则）：草帽 → 帽子，不是草
  │
  ├─ ② 塔罗式组合（COMBO）：抽象词 → 两个已有意象
  │     └─ 时间 = 沙漏 + 月亮
  │
  ├─ ③ 抽象词 → 31 张抽象图形牌之一（“行为像它”的形状）
  │     └─ 记忆 = 涟漪，被困 = 牢笼
  │
  ├─ ④ 不认识的名词：按梦的情绪抽一张“心”牌，写上这个词，记入缺失日志
  │
  └─ 什么都对应不上 → 读情绪和激烈度，抽三张牌（天 · 心 · 地）组成一幅画
```

### 2. 逐步说明

### ① 词库与物件词尾规则

- 中文按子串匹配，英文按整词匹配（允许 s / es / ing / ed）。同一场景里取最长的词优先。
- **物件看词尾**：复合词的最后一部分说明它是什么东西。保温杯、啤酒瓶、玻璃瓶 → 分别落到杯子、瓶子；`paper bag` → 袋子，不是纸。
- 相连的命中只保留最后一个（如果它是物件）：水果刀 → 刀；连衣裙 → 裙子。
- 被更长的物件词包住的命中不算：剪刀里的“刀”不是刀具。
- 假复合词写在 `LEX_NOT`：面包不是“包”，地球不是“球”，蛋糕不是“蛋”。


（组合牌与概念形状见第三、四节。）

#### ④ 不认识的名词、完全对应不上的梦

不再用随机形状。按梦的情绪和激烈度从 31 张图形牌里抽（规则见第六节），画面下方写明“按情绪抽到”，并记入“少了什么？”缺失日志。

### 例子

| 输入 | 命中 | 画面 | 画面下方的说明 |
| --- | --- | --- | --- |
| 一把保温杯 | 词尾“杯” | 杯子 | 识别到：杯 |
| paper bag | 词尾 bag，纸被让位 | 袋子 | 识别到：bag |
| 我梦见时间一直在流逝 | 组合 | 沙漏 + 月亮 | 时间（组合：流逝，在夜里） |
| 婚礼上朋友都来了 | 两张组合 | 裙子 + 心 + 手 | 婚礼（组合：礼服与心）、朋友（组合：握住的手） |
| 我被谎言困住，到处是秘密 | 组合 + 概念（有位置才画） | 刀 + 心（+ 绳结） | 谎言（组合：伤在心上） |
| 量子打印机一直在响，我很害怕 | 没有画面词 | 按情绪抽三张：帷幕 + 尖塔（写着“量子”）+ 声波 | 没认出具体的东西，按情绪抽了三张牌（恐惧）、量子（按情绪抽到：尖塔，尖锐、层层逼近） |


## 八、测试、增加新词与局限

### 怎么测试

- `node tests/classify.js`：96 个词，检查它们被分到物件 / 组合 / 概念 / 未归类哪一类。
- `node tests/tarot.js`：31 张牌都能画出来；读情绪和激烈度是否合理；三张牌是否天、心、地各一张、不重复、同一个梦结果稳定；“心”牌是否属于最适合那种情绪的前 5 张。
- `node tests/coverage.js`（含 36 个“常见梦境”测试梦）：104 个梦境的召回和精度。
- 诚实说明：组合表和其中 8 个测试词是我们一起写的，所以那部分的 100% 只说明规则能执行，不说明泛化；物件词尾的第二批 32 词是调规则之前没见过的，第一次是 30/32。真正的检验是 19 号的玩家测试和缺失日志。

### 怎么增加一个新词

1. 它是一个**东西**吗？把词尾字加到对应物件原型的词里（`js/lexicon.js` 里 `LEX.cup` 这类）。
2. 它是一个**想法**吗？先想有没有两个已有意象能叠出来 → 加一行到 `COMBO`；做不到再想它“像什么行为” → 加到 `CONCEPT`。
3. 加完后跑 `node tests/classify.js`，并在 PROGRESS.md 里记下为什么这么对应。

### 已知局限

- 物件是通用画法：所有瓶子长得一样。
- 组合表目前 28 条，是人工写的；表里没有的抽象词会落到图形牌或按情绪抽牌。
- 31 张牌的情绪亲和度和激烈度是我们凭感觉定的，需要玩家测试来校正。
- 意象多时画面会挤，沙漏这类小意象会被淹没。
- 中文没有词典分词，生僻复合词的词尾规则可能误判。
