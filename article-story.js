// The article can be opened at any point. Only refer to observations in this run.
export function articleDialogue(state){
 const known=new Set(state.clues||[]);
 if(known.has('morningShared'))return {husband:'「朝のラーメン、一緒に食べられてうれしかった。でも、最近ちょっと食べすぎで」',wife:'「おいしかったね。……その話も、聞かせて？」'};
 if(known.has('ramen')&&known.has('chicken'))return {husband:'「朝はラーメン、昼は弁当にチキンまで。つい、食べすぎちゃって」',wife:'「今日、楽しそうに食べてたね。……この続き、一緒に見よう」'};
 if(known.has('ramen'))return {husband:'「朝のラーメンも好きでさ。つい、食べすぎちゃうんだ」',wife:'「あの一杯、おいしそうだった。……続きを見せて？」'};
 if(known.has('chicken'))return {husband:'「弁当のほかにチキンも。つい、食べすぎちゃうんだ」',wife:'「お昼、楽しそうだったね。……続きを見せて？」'};
 return {husband:'「好きなもの、つい食べすぎちゃうんだ」',wife:'「……そうだったんだ。続きを見せて？」'};
}
