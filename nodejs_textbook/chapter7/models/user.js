const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            name:{
                type:Sequelize.STRING(20),
                allowNull:false,
                unique:true,
            },
            age:{
                type:Sequelize.INTEGER.UNSIGNED,
                allowNull:false,
            },
            married:{
                type:Sequelize.BOOLEAN,
                allowNull:false,
            },
            comment:{
                type:Sequelize.TEXT,
                allowNull:true,
            },
            created_at:{
                type:Sequelize.DATE,
                allowNull:false,
                defaultValue:Sequelize.NOW,
            },
        }, {
            sequelize,
            timestamps:false,
            underscored:false,
            modelName:'User',
            tableName:'users',  //mySQL 테이블 명 들어가는 곳
            paranoid:false,
            charset:'utf8',
            collate:'utf8_general_ci',
        });

    }
    //관계설정 1:N = USER : COMMENT
    static associate(db) {
        //hasMany : 현재 모델의 정보가 다른 모델로 들어갈 때
        db.User.hasMany(db.Comment,{foreignKey:'commenter',sourceKey:'id'});
    }
};

