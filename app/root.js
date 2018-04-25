import React,{ Component } from 'react'
import './../static/css/common.css'
import './../static/css/reset.css'
import Header from './components/header'
import Player from './page/player'
import { MUSIC_LIST } from './config/musiclist'
import MusicList from './page/musiclist'
import { Router,IndexRoute,Link,Route,hashHistory } from 'react-router'
import Pubsub from 'pubsub-js'

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            musicList:MUSIC_LIST,
            currentMusicItem:MUSIC_LIST[3],
            repeatType: 'cycle'
        }
    }
    playMusic(musicItem){
        $("#player").jPlayer("setMedia",{
            mp3:musicItem.file
        }).jPlayer('play');
        this.setState({
            currentMusicItem:musicItem
        })
    }
    playNext(type = "next"){
        let index = this.findMusicIndex(this.state.currentMusicItem);
        let newIndex = null;
        let musicListLength = this.state.musicList.length;
        if(type === 'next'){
            newIndex = (index + 1 ) % musicListLength;
        }else{
            
            newIndex = (index - 1 + musicListLength) % musicListLength;
        }
        this.playMusic(this.state.musicList[newIndex])
    }
    playWhenEnd() {
        if (this.state.repeatType === 'random') {
            let index = this.findMusicIndex(this.state.currentMusicItem);
            let musicLength = this.state.musicList.length;
            let randomIndex = this.randomRange(0, musicLength - 1);
            /*while(randomIndex === index) {
                randomIndex = this.randomRange(0, musicLengthh - 1);
            }*/
            this.playMusic(this.state.musicList[randomIndex]);
        } else if (this.state.repeatType === 'once') {
            this.playMusic(this.state.currentMusicItem);
        } else {
            this.playNext();
        }
    }
    randomRange(under, over) {
        return Math.ceil(Math.random() * (over - under) + under);
    }
    findMusicIndex(musicItem){
        return this.state.musicList.indexOf(musicItem);
    }
    componentDidMount(){
        var file = this.state.currentMusicItem;
        $("#player").jPlayer({
            supplied:'mp3',
            wmode:'window',
            useStateClassSkin: true
        })
        this.playMusic(file);
        $("#player").bind($.jPlayer.event.ended,(e)=>{
            this.playWhenEnd();
        })
        Pubsub.subscribe('PLAY_MUSIC',(msg,musicItem)=>{
            this.playMusic(musicItem);
        })
        Pubsub.subscribe('DELETE_MUSIC',(msg,musicItem)=>{
            this.setState({
                musicList:this.state.musicList.filter(item=>{
                    return item !== musicItem;
                })
            })
        })
        Pubsub.subscribe('PLAY_PRE',(msg)=>{
            this.playNext('pre');
        })
        Pubsub.subscribe('PLAY_NEXT',(msg)=>{
            this.playNext();
        })
        let repeatList = ['cycle','once','random'];
        Pubsub.subscribe('CHANAGE_REPEAT',(msg)=>{
            let index = repeatList.indexOf(this.state.repeatType);
            index = (index + 1) % repeatList.length;
            this.setState({
                repeatType: repeatList[index]
            });
        })
    }
    componentWillUnmount(){
        console.log("componentWillUnMount");
        Pubsub.unsubscribe('PLAY_MUSIC');
        Pubsub.unsubscribe('DELETE_MUSIC');
        Pubsub.unsubscribe('PLAY_PRE');
        Pubsub.unsubscribe('DELETE_NEXT');
        PubSub.unsubscribe('CHANAGE_REPEAT');
        $("#player").unbind($.jPlayer.event.ended);
    }
    render(){
        let currentMusicItem = this.state.currentMusicItem;
        let musicList = this.state.musicList;
        //<Player currentMusicItem = {currentMusicItem}></Player>
        //<MusicList currentMusicItem = {currentMusicItem} musicList = {musicList}></MusicList>
        return(
            <div>
                <Header />
                {
                    React.cloneElement(this.props.children,this.state)
                }
            </div>
            )
    }
}

class Root extends Component {
    render(){
        return(
            <Router history={hashHistory}>
                <Route path="/" component={App}>
                    <IndexRoute component={Player}></IndexRoute> 
                    <Route path="/list" component={MusicList}></Route>
                </Route> 
            </Router>
        )
    }
}

export default Root;