export default () => {
  const imagePaths = [
    "https://cf.product-image.s.zigzag.kr/original/d/2024/11/11/3887_202411111613170833_42924.jpeg?width=400&height=400&quality=80&format=jpeg",
    "https://cf.product-image.s.zigzag.kr/original/d/2024/10/29/25938_202410290925530134_28014.gif?width=400&height=400&quality=80&format=jpeg",
    "https://cf.product-image.s.zigzag.kr/original/d/2024/11/4/25938_202411041305120961_14186.gif?width=400&height=400&quality=80&format=jpeg",
    "https://cf.product-image.s.zigzag.kr/original/d/2024/11/4/25938_202411041311410464_93507.gif?width=400&height=400&quality=80&format=jpeg",
    "https://cf.product-image.s.zigzag.kr/original/d/2024/11/11/3887_202411111613450352_28116.jpeg?width=400&height=400&quality=80&format=jpeg",
    "https://cf.product-image.s.zigzag.kr/original/d/2024/11/1/2833_202411011251590341_91132.gif?width=400&height=400&quality=80&format=jpeg",
    "https://cf.product-image.s.zigzag.kr/original/d/2024/1/30/4600_202401301106380411_71439.gif?width=400&height=400&quality=80&format=jpeg",
    "https://cf.product-image.s.zigzag.kr/original/d/2024/11/5/10213_202411051857430235_14188.jpeg?width=400&height=400&quality=80&format=jpeg",
    "https://cf.product-image.s.zigzag.kr/original/d/2024/11/6/11864_202411060849430590_17808.gif?width=400&height=400&quality=80&format=jpeg",
    "https://cf.product-image.s.zigzag.kr/original/d/2024/9/20/92_202409201508010184_62129.gif?width=400&height=400&quality=80&format=jpeg",
    "https://cf.product-image.s.zigzag.kr/original/c/12/842/622/128426225-4524107513318078167.gif?width=400&height=400&quality=80&format=jpeg",
    "https://cf.product-image.s.zigzag.kr/original/d/2024/11/13/46030_202411131533480522_55776.gif?width=400&height=400&quality=80&format=jpeg",
  ];
  return imagePaths[Math.floor(Math.random() * imagePaths.length)];
};
