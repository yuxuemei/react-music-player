import React, { Component } from 'react'
import MusicListItem from './../components/musiclistitem'
class MusicList extends Component{
    constructor(props){
        super(props);
    }
    render(){
    	let listEle = null;
    	listEle = this.props.musicList.map((item,index)=>{
            return (
            	<MusicListItem focus={item === this.props.currentMusicItem} key={item.id} musicItem={item}>{item.title}</MusicListItem>	
            )	
    	})

    	return(
    		<ul>
    		{listEle}
    		</ul>
    	)
    }
}

export default MusicList