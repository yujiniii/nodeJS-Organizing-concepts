async function getUser(){
    try{
        const res = await axios.get('/users');
        const users = res.data;
        const list = document.getElementById('list');
        list.innerHTML='';
        //사용자마다 반복적으로 화면 표시 및 이벤트 연결

        Object.keys(users).map(function(key){
            const userDiv = document.createElement('div');
            const span = document.createElement('span');
            
            span.textContent = users[key];
            const edit = document.createElement('button');

            edit.textContent = '수정';
            edit.addEventListener('click',async () =>{
                const name = prompt('바꿀 이름을 입력하세요');
                if(!name){
                    return alert('이름을 반드시 입력하여야 합니다');
                }
                try{
                    await axios.put('/user/'+key,{name});
                    getUser();
                }
                catch(err){
                    console.error(err);
                }
            });
            const remove = document.createElement('button');
            remove.textContent = '삭제';
            remove.addEventListener('click', async () => {
                try{
                    await axios.delete('/user/'+key);
                    getUser();
                }
                catch(err){
                    console.error(err);
                }
            });
            userDiv.appendChild(span);
            userDiv.appendChild(edit);
            userDiv.appendChild(remove);
            userDiv.appendChild(userDiv);
            console.groupCollapsed(res.data);
        });
    }
    catch(err){
        console.error(err);
    }
}

window.onload=getUser;
document.getElementById