const Sequelize = require('sequelize');

module.exports = class Comment extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            comment:{
                type:Sequelize.STRING(30),
                allowNull:false,
            },
            created_at:{
                type:Sequelize.DATE,
                allowNull:true,
                defaultValue:Sequelize.NOW,
            },
        },{
            sequelize,
            timestamps:false,
            modelName:'Comment',
            tableName:'comments',
            paranoid:false,
            cherset:'utf8mb4',
            collate:'utf8mb4_general_ci',
        });
    }
    //관계설정 1:N = USER : COMMENT
    static associate(db){
        //belongTo:현재 모델에서 다른 모델의 정보를 받아올 때 == 다른 모델의 정보가 들어갈 때
        db.Comment.belongsTo(db.User,{foreignKey:'commenter',targetKey:'id'});
    }
}

//1:1 == hasOne - belongTo 
//N:M == belongToMany - belongToMany 새로운 모델 생성, through:새 모델명