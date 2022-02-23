/* roadbook 사이트의 신간 안내를 크롤링하는 예제*/
const axios = require("axios");
const cherrio = require("cheerio");

const getHtml = async () =>{
    try{
        return await axios.get("https://roadbook.co.kr/category/%EC%8B%A0%EA%B0%84%EC%86%8C%EA%B0%9C");
    } catch(error){
        console.error(error);
    }
};

getHtml()
    .then(html=>{
        let ulList = [];
        const $ = cherrio.load(html.data);
        const $bodyList = $("div#searchList ol").children("li");

        $bodyList.each(function (i,elem) {
            ulList[i] = {
                bookList: $(this).find('a').text(),
                url:$(this).find('a').attr('href'),
            };
        });
        const data = ulList.filter(n=>n.bookList);
        return data;
    })
    .then(res => console.log(res));
