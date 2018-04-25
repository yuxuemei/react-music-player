import React,{ Component } from 'react'
import { Link }  from 'react-router'
import Progress from './../components/progress'
import Pubsub from 'pubsub-js'
import './player.less'
let duration = null;
class Player extends Component {
    constructor(props){
        super(props);
        this.state = {
            progress:0,
            volume:0,
            isPlay:true,
            leftTime:''
        }
        this.progressChangeHandler = this.progressChangeHandler.bind(this);
        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);
        this.play = this.play.bind(this);
    }
    formatTime(time){
        time = Math.floor(time);
        let miniutes = Math.floor(time / 60);
        let seconds = Math.floor(time % 60);
        seconds = seconds < 10? `0${seconds}`:seconds;
        return `${miniutes}:${seconds}`;
    }
    componentDidMount(){      
        $("#player").bind($.jPlayer.event.timeupdate,(e)=>{
            //总时长
            duration = e.jPlayer.status.duration;

            //console.log(duration);
            this.setState({
                progress:e.jPlayer.status.currentPercentAbsolute,
                volume:e.jPlayer.options.volume * 100,
                leftTime:this.formatTime(duration*(1 - e.jPlayer.status.currentPercentAbsolute/100))
            });
        })
    }
    //解绑之前
    componentWillUnmount(){
        $("#player").unbind($.jPlayer.event.timeupdate);
    }
    play(){
        if(this.state.isPlay){
            $("#player").jPlayer("pause");
        } else {
            $("#player").jPlayer("play");
        }
        this.setState({
            isPlay:!this.state.isPlay
        })
    }
    prev(){
        Pubsub.publish('PLAY_PRE');
    }
    next(){
        Pubsub.publish('PLAY_NEXT');
    }
    changeRepeat() {
        PubSub.publish('CHANAGE_REPEAT');
    }
    progressChangeHandler(progress){
        this.setState({
            progress:this.state.duration*progress
        })
        $("#player").jPlayer('play',duration*progress);
    }
    changeVolumeHandler(progress){
        $("#player").jPlayer('volume',progress);
        this.setState({
            volume: progress * 100
        })
    }
    render(){
        return(
            <div className="player-page">
                <h1 className="caption"><Link to="/list">我的私人音乐坊 &gt;</Link></h1>
                <div className="mt20 row">
                    <div className="controll-wrapper">
                        <h2 className="music-title">{this.props.currentMusicItem.title}</h2>
                        <h3 className="music-artist mt10">{this.props.currentMusicItem.artist}</h3>
                        <div className="row mt20">
                            <div className="left-time -col-auto">-{this.state.leftTime}</div>
                            <div className="volume-container">
                                <i className="icon-volume rt" style={{top: 5, left: -5}}></i>
                                <div className="volume-wrapper">
                                    <Progress
                                        progress={this.state.volume}
                                        onProgressChange={this.changeVolumeHandler}
                                        barColor='#aaa'
                                    >
                                    </Progress>
                                </div>
                            </div>
                        </div>
                        <div style={{height: 10, lineHeight: '10px'}}>
                            <Progress
                                progress={this.state.progress}
                                onProgressChange={this.progressChangeHandler}
                            >
                            </Progress>
                        </div>
                        <div className="mt35 row">
                            <div>
                                <i className="icon prev" onClick={this.prev}></i>
                                <i className={`icon ml20 ${this.state.isPlay ? 'pause' : 'play'}`} onClick={this.play}></i>
                                <i className="icon next ml20" onClick={this.next}></i>
                            </div>
                            <div className="-col-auto">
                                <i className={`icon repeat-${this.props.repeatType}`} onClick={this.changeRepeat}></i>
                            </div>
                        </div>
                    </div>
                    <div className="-col-auto cover">
                        <img src={this.props.currentMusicItem.cover} alt={this.props.currentMusicItem.title}/>
                    </div>
                </div>
            </div>
            )
    }
}

export default Player;