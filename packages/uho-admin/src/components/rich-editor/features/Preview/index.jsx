// import React from 'react'
// import Icon from '../../components/Icon'
// import HtmlSerializer from '../../utils/html'

// /**
//  * @param html 原始编辑的html字符串
//  * @return 最后展示的html
//  */
// const getHTML = (html) => {
// 	// 正则替换game标签
// 	const gameReg = /<game.*?(>|\/>)/gi
// 	const newHtml = html.replace(gameReg, function(string) {
// 		const icon = string.match(/icon=[\'\"]?([^\'\"]*)[\'\"]?/i)[1]
// 		const name = string.match(/name=[\'\"]?([^\'\"]*)[\'\"]?/i)[1]
// 		const category = string.match(/category=[\'\"]?([^\'\"]*)[\'\"]?/i)[1]
// 		const rating = string.match(/raring=[\'\"]?([^\'\"]*)[\'\"]?/i)[1]
// 		return `
//     <div class="game">
//         <img src=${icon} alt="游戏图标" />
//         <div class="info">
//         <div class="name">${name}</div>
//         <div class="category">${category}</div>
//       </div>
//       <div class="score">
//         <span class="num">${parseFloat(rating).toFixed(1)}</span>
//         <span class="unit">分</span>
//       </div>
//     </div>
//     `
// 	})

// 	return `
//  <!DOCTYPE html>
//  <html lang="en">
//  <head><meta charset="UTF-8">
//  <meta name="viewport" content="width=device-width, initial-scale=1.0">
//  <meta http-equiv="X-UA-Compatible" content="ie=edge">
//  <style>
//    img{
//      max-width:100%;
//    }
//    body{
//      padding:12px 4%;
//      margin:0;
//    }
//    p{
//      line-height: 27px;
//      font-size: 17px;
//      color:#242529;
//      margin: 12px 0;
//      word-wrap:break-word;
//      word-break:break-all;
//    }
//    .game {
//      max-width: 80%;
//      display: flex;
//      justify-content: center;
//      margin: 1em auto;
//      box-shadow: 0px 0px 7px 0px rgba(172, 172, 172, 0.5);
//      border-radius: 4px;
//      height: 80px;
//      padding: 10px 20px;
//    }
//    .game img {
//       width: 60px;
//       height: 60px;
//       border-radius: 10px;
//       margin:0;
//       cursor:auto;
//    }
//    .game .score {
//     line-height: 60px;
//     color: #242529;
//    }
//    .game .score .num {
//     font-size: 16px;
//     font-weight: bold;
//    }
//    .game .score .unit {
//     font-size: 12px;
//     margin-left: 4px;
//    }
//    .game .info {
//     padding: 9px 10px;
//     flex-grow: 1;
//    }
//    .game .info .name {
//       color: #242529;
//       font-size: 16px;
//       line-height: 16px;
//     }
//     .game .info .category {
//       color: #12a192;
//       font-size: 12px;
//       margin-top: 8px;
//     }
//  </style>
//  </head>
//  <body>${newHtml}</body>
//  </html>
//  `
// }

// const showPreview = (value) => {
// 	const html = HtmlSerializer.serialize(value)
// 	if (window.previewWindow) {
// 		window.previewWindow.close()
// 	}
// 	window.previewWindow = window.open('/')
// 	window.previewWindow.document.write(getHTML(html))
// }

// const Component = ({ value }) => (
// 	<Icon
// 		name="window-maximize"
// 		tip="预览"
// 		onClick={(e) => {
// 			showPreview(value)
// 		}}
// 	/>
// )

// Component.getHTML = getHTML

// export default Component
