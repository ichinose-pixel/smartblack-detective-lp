
export const art=k=>['morning-street','morning-ramen','lunch','office','office-hall','sunset-station','return','phone-looking','caught-calm','bento-last'].includes(k)?'assets/v3/'+k+'.webp':'assets/detective/'+k+'.webp';
export const memories={
 ramen:{title:'朝だけの、あの顔',hint:'朝の店で',image:'morning-ramen',text:'家で見る顔と、ちょっと違う。小さな一杯を、心から楽しんでいた。'},
 lunch:{title:'お弁当と、もう一品',hint:'昼の手元で',image:'lunch',text:'弁当箱の隣にチキン。いつものお昼にも、知らない楽しみがあった。'},
 bento:{title:'最後に残すもの',hint:'昼のひと口で',image:'bento-last',text:'好きな卵焼きは最後に。そんな食べ方、知らなかった。'},
 work:{title:'家では聞かない声',hint:'午後の仕事で',image:'office',text:'「ここは僕が説明する」。背筋が伸びた、頼もしい声。'},
 phone:{title:'帰ってきた、いつもの人',hint:'帰宅してから',image:'return',text:'朝に頼んだ牛乳と、少し気になっていた一杯。夫の一日は、ちゃんと家へつながっていた。'}
};
const clone=x=>JSON.parse(JSON.stringify(x)),has=(s,k)=>s.clues.includes(k);
export function newGame(){return {node:'title',hearts:3,notice:0,clues:[],memories:[],found:[],failed:false,history:[],lastChoice:''};}
const c=(id,label,to,extra={})=>({id,label,to,...extra}),next=(to)=>[c('next','つづける',to)];
const v=(phase,bg,sprite,time,place,speaker,text,choices,extra={})=>({phase,bg,sprite,time,place,speaker,text,choices,...extra});
export function view(s){
 const H=(who,t,ch,e={})=>v(0,'bg-home','neutral','07:10','朝の自宅',who,t,ch,e);
 const A=(who,t,ch,e={})=>v(1,'morning-street',null,'07:45','通勤途中',who,t,ch,e);
 const L=(who,t,ch,e={})=>v(3,'bg-store','neutral','12:15','昼休み',who,t,ch,e);
 const W=(who,t,ch,e={})=>v(4,'office-hall',null,'15:20','午後のオフィス',who,t,ch,e);
 const E=(who,t,ch,e={})=>v(5,'sunset-station','phone-looking','18:10','帰り道',who,t,ch,e);
 const N=(who,t,ch,e={})=>v(6,'bg-home-night','return','18:45','帰宅',who,t,ch,e);
 switch(s.node){
 case 'title':return H('','', [c('next','夫の一日を、覗いてみる','home')],{title:true});
 case 'home':return H('修司','「お弁当、ありがとう。帰りに牛乳、買ってくるね」',next('phoneGlance'));
 case 'phoneGlance':return H('私（心の声）','私が近づくと、スマホを伏せた。……誰か、いるの？',next('commute'),{sprite:'phone-looking'});
 case 'commute':return A('私（心の声）','今日は私も、駅前に用事。一本早い電車の夫を、見つけた。',next('morning'),{sprite:'neutral',wide:true,chapter:'朝　通勤'});
 case 'morning':return A('私（心の声）','会社の手前で、ガラス戸の店へ。……慣れてる。',[c('window','窓際の席に、目をこらす','ramen',{clues:['ramen'],memory:'ramen'}),c('menu','店先で「いつもの」の注文を聞く','menu',{clues:['morningMenu']})],{peek:true,focus:'shop'});
 case 'ramen':return A('私（心の声）','……朝ラーメン！ そんな顔して食べるんだ。',[c('order','私も、同じ一杯を頼んでみる','morningRisk',{notice:2}),c('watch','店を出たあとの行き先を見届ける','officeArrival')],{bg:'morning-ramen',cg:true,peek:true,cutin:'見つけた。'});
 case 'menu':return A('店員の声','「朝の小さいラーメン、いつもので？」',[c('order','気になる。私も「いつもの」を頼む','morningRisk',{notice:2,clues:['ramen'],memory:'ramen'}),c('watch','次は、会社へ向かうか見届ける','officeArrival')],{prop:'menu',focus:'shop'});
 case 'morningRisk':return A('私（心の声）','扉の鈴。夫の顔が、入口へ上がりかけた。',[c('face','同じ一杯を頼んで、隣の席へ','morningCaught',{found:'morning',clues:['ramen','morningShared']}),c('leave','レジ待ちの人の後ろから、外へ戻る','officeArrival')],{bg:'morning-ramen',cg:true,warning:true});
 case 'morningCaught':return A('修司','「あれ、君も？ ……隣、座る？」',[c('coincidence','「偶然。ここのおすすめ、教えて」','morningInvite',{clues:['routine']}),c('usual','「“いつもの”って、常連さん？」','morningUsual',{clues:['routine']})],{sprite:'caught-calm',caught:true});
 case 'morningInvite':return A('修司','「じゃあ、僕と同じの。こうして朝に外で食べるの、久しぶりだね」',next('officeArrival'),{bg:'morning-ramen',sprite:null,cg:true,sub:'夫は出勤へ。私は駅前の用事へ。'});
 case 'morningUsual':return A('修司',has(s,'morningMenu')?'「声、聞こえた？ 朝会の日だけ。会社に行く前の、小さな楽しみ」':'「朝会の日だけね。……ここで会うと、なんだか照れるな」',next('officeArrival'),{bg:'morning-ramen',sprite:null,cg:true,sub:'夫は出勤へ。私は駅前の用事へ。'});
 case 'officeArrival':return v(2,'morning-street','neutral','08:05','会社の前','私（心の声）','いつものビルへ、会釈をして入っていく。……ここまでは、いつも通り。',next('lunch'),{wide:true,chapter:'出勤'});
 case 'lunch':return L('女性の声','「昨日の続き……二人で、いいですか？」',[c('voices','二人の会話の続きを聞く','colleagueTalk',{clues:['colleague','busy']}),c('bags','夫が持つ、二つの包みを見る','lunchMeal',{clues:['chicken','colleague'],memory:'lunch'})],{colleague:true,peek:true,chapter:'昼休み',sub:'女性が顔を寄せた。二人の手元は、夫の陰で見えない。'});
 case 'colleagueTalk':return L('女性の声','「ここだけ、見てください。……昨日、話したところ」',next('colleagueReply'),{colleague:true,wide:true});
 case 'colleagueReply':return L('修司','「この数字だね。午後の会議は、僕が説明するよ」',next('afternoon'),{colleague:true,wide:true,sub:'開いたのは会議の資料。耳打ちに見えたのは、数字の確認だった。'});
 case 'lunchMeal':return L('私（心の声）','お弁当と、チキンの二刀流。……お昼も、楽しそうだ。',[c('lastBite','最後のひと口まで、見届ける','lastBite',{clues:['favorite'],memory:'bento'}),c('join','「隣、空いてますか？」と近づく','lunchRisk',{notice:2})],{bg:'lunch',sprite:null,cg:true,peek:true,cutin:'もうひとつ。',sub:'「課長、午後の会議で！」女性は会社へ戻っていった。'});
 case 'lastBite':return L('私（心の声）','卵焼きだけ、最後に。……好きなものは最後派だったんだ。',next('afternoon'),{bg:'bento-last',sprite:null,cg:true,focus:'bento'});
 case 'lunchRisk':return L('私（心の声）','植え込みの切れ目。夫が、空いた席へ顔を向けかけた。',[c('face','席に進んで、最後に残した一品を聞く','lunchCaught',{found:'lunch',clues:['chicken']}),c('leave','植え込み沿いに抜けて、会社入口へ回る','afternoon')],{bg:'lunch',sprite:null,cg:true,warning:true});
 case 'lunchCaught':return L('修司',has(s,'morningShared')?'「また会ったね。駅前の用事、終わった？」':'「わ、びっくりした。君も駅前に来てたんだ」',[c('bite','「その卵焼き、最後まで残すの？」','lunchBento',{clues:['favorite','favoriteTold'],memory:'bento'}),c('woman','「さっきの人と、よくお昼に？」','lunchWoman',{clues:['colleague','busy','colleagueTold']})],{sprite:'caught-calm',caught:true});
 case 'lunchBento':return L('修司','「好きだから最後。……一口いる？ ほんとは渡したくないけど」',next('afternoon'),{bg:'lunch',sprite:null,cg:true,sub:'笑って別れ、夫は会社へ戻っていった。'});
 case 'lunchWoman':return L('修司','「同じチームの人。午後の説明を一緒にするから、買い出しついでに打ち合わせ」',next('afternoon'),{sprite:'neutral',sub:'「じゃ、また夜に」。夫は会社へ戻っていった。'});
 case 'afternoon':return W('私（心の声）','書店へ向かう、ビルの共用通路。ガラスの向こうで、夫が袖をまくった。',[c('voice','家では聞かない、その声を聞く','workFace',{clues:['work'],memory:'work'}),c('message','「夕飯、何時にする？」と送る','reply',{clues:['detour','detourMessage']})],{bg:'office',cg:true,focus:'office-intro',chapter:'午後　仕事'});
 case 'workFace':return W('修司','「ここは僕が説明する。大丈夫。君は次の準備をお願い」',next('evening'),{bg:'office',cg:true,focus:'office-voice',cutin:'知らない声。'});
 case 'reply':return W('私（心の声）','返事が来た。……私には、いつもの夫。',next('evening'),{message:has(s,'busy')?'会議が終わったら帰るよ。駅北口が工事で、商店街をまわる。牛乳も忘れない。':'18時すぎに出るよ。駅北口が工事で、商店街をまわる。牛乳も忘れない。'});
 case 'evening':return E('私（心の声）',has(s,'detour')?'連絡どおり、駅へは商店街を通るんだ。……でも、またスマホ？':'夕方、駅前で夫を見つけた。改札の手前で曲がって、またスマホ。',[
 c('reflection','ガラスに映る画面を追う','reflection',{clues:['box']}),
 c('route','夫が曲がった道の先を見る','route',{clues:['detour']}),
 c('screen','すぐ後ろなら、画面が読めそう','eveningRisk',{notice:2})
 ],{chapter:'夕方　帰り道',sub:'店の窓には、こちらの姿も映っている。'});
 case 'reflection':return E('私（心の声）','誰かの写真……じゃない。黒い箱と、商品らしい画面。',next('meet'),{focus:'screen',prop:'screen',sprite:'phone-looking'});
 case 'route':return E('私（心の声）',has(s,'detourMessage')?'連絡どおり、工事の柵。その先に駅への矢印。……ちゃんと帰るんだ。':'工事の柵。その先に、駅への矢印。……寄り道に見えただけ？',next('meet'),{wide:true,focus:'detour',sprite:null});
 case 'eveningRisk':return E('私（心の声）','画面まで、あと少し。ガラスに映った夫が、顔を上げかけた。',[c('face','画面の黒い箱を、もう一歩近くで読む','eveningCaught',{found:'evening',clues:['box']}),c('leave','柱の陰へ戻り、駅への案内を確かめる','route',{clues:['detour']})],{sprite:'phone-looking',warning:true});
 case 'eveningCaught':return E('修司',s.found.length>1?'「あ、また君だ。今日はよく会うね。一緒に帰ろう」':'「わっ！ ……そっちも帰り？ 一緒に帰ろう」',next('returnHome'),{sprite:'caught-calm',caught:true});
 case 'meet':return E('私','「お疲れさま。……一緒に帰ろう」',next('returnHome'),{sprite:'neutral'});
 case 'failed':return E('私（心の声）','また見つかった。今日は、ここまで。',[c('retry','朝から、もう一度','title',{restart:true}),c('tonight','帰ってから、確かめる','returnHome')],{failed:true,sprite:'caught-calm',cutin:'尾行、終了。'});
 case 'returnHome':return N('修司','「ただいま。牛乳、冷蔵庫に入れておくね」',next('askPhone'),{chapter:'帰宅',sub:s.failed?'その夜、夫はいつも通り帰ってきた。':'朝の一言を、ちゃんと覚えていた。'});
 case 'askPhone':return N('私',has(s,'box')?'「ねえ。さっきの画面、黒い箱が見えたけど……何？」':'「ねえ。朝から、スマホで何を見てたの？」',next('reveal'),{sprite:'phone'});
 case 'reveal':return N('修司','「これ。スマートブラックっていうコーヒー。少し気になってて」',next('reason'),{sprite:'phone',phone:true});
 case 'reason':return N('修司','「朝にラーメン、昼は弁当にチキンまで。最近、お腹も気になって。食べ方から見直そうと思ってさ」',[
 ...(has(s,'ramen')?[c('ramenQ',has(s,'morningShared')?'「朝、一緒に食べられてよかった」':'「朝のあの顔、初めて見た」','recapRamen')]:[]),
 ...(has(s,'favorite')?[c('bentoQ',has(s,'favoriteTold')?'「明日も、卵焼き入れておくね」':'「卵焼き、そんなに好きだった？」','recapBento')]:[c('lunchQ',has(s,'chicken')?'「お昼、楽しそうだったね」':'「お弁当に、チキンも食べてたんだ」','recapLunch')]),
 ...(has(s,'work')?[c('workQ','「会社での声、ちょっと違った」','recapWork')]:[c('phoneQ','「一緒に見てみてもいい？」','recapPhone')])
 ],{sprite:'phone',phone:true});
 case 'recapRamen':return N('修司',has(s,'morningShared')?'「うん。隣に君がいる朝も、いいね。また一緒に行こう」':'「……そこ、見てたの？ 君も食べたら、きっと同じ顔になるよ」',next('ending'),{bg:'morning-ramen',sprite:null,cg:true,wide:true,recap:true});
 case 'recapBento':return N('修司',has(s,'favoriteTold')?'「ありがとう。明日も最後に食べるよ。……これはもう、ばれちゃったね」':'「好物は、最後に取っておきたいんだ。……今さら言うの、照れるな」',next('ending'),{bg:'bento-last',sprite:null,cg:true,wide:true,recap:true});
 case 'recapLunch':return N('修司',has(s,'colleagueTold')?'「さっき話した打ち合わせの帰りに、つい。お弁当も、ちゃんと全部食べたよ」':has(s,'chicken')?'「見えてた？ つい一品足しちゃって。お弁当も、ちゃんと全部食べたよ」':'「そう。つい一品足しちゃって。お弁当も、ちゃんと全部食べたよ」',next('ending'),{bg:'lunch',sprite:null,cg:true,wide:true,recap:true});
 case 'recapWork':return N('修司','「家だと、気が抜けるからね。……君の前では、いつもの僕でいたい」',next('ending'),{bg:'office',sprite:null,cg:true,wide:true,recap:true});
 case 'recapPhone':return N('修司','「もちろん。買う前に、ちゃんと読んでおこうと思ってたんだ」',next('ending'),{sprite:'phone',phone:true});
 case 'ending':return N('私（心の声）','秘密は、誰かとの恋じゃなかった。食べる楽しみと、本人なりの気がかり。……ねえ、その記事、私にも見せて。',[],{sprite:'return',ending:true});
 default:throw Error('Unknown node '+s.node);
 }
}
export function choose(state,id){
 const option=view(state).choices.find(c=>c.id===id);if(!option)throw Error('Invalid '+state.node+':'+id);
 if(option.restart)return newGame();
 const s=clone(state),snapshot=clone(state);delete snapshot.history;s.history.push(snapshot);s.node=option.to;s.lastChoice=id;
 if(['officeArrival','lunch','afternoon','evening','returnHome'].includes(s.node))s.notice=0;
 s.notice=Math.min(3,s.notice+(option.notice||0));
 for(const k of option.clues||[])if(!s.clues.includes(k))s.clues.push(k);
 if(option.memory&&!s.memories.includes(option.memory))s.memories.push(option.memory);
 if(option.found){if(s.found.includes(option.found))throw Error('Duplicate found');s.found.push(option.found);s.hearts--;s.notice=3;if(!s.hearts){s.failed=true;s.node='failed';}}
 if(s.node==='ending'&&!s.memories.includes('phone'))s.memories.push('phone');
 return s;
}
export function back(s){if(!s.history.length)return s;const h=s.history.slice();return {...h.pop(),history:h};}


