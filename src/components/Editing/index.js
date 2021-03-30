import React, { Component } from 'react';
import './editing.css';
import Searchbar from './Searchbar';
import { Switch, Route } from "react-router-dom";
import { withRouter } from "react-router";
import PlaylistPage from '../Playlist/PlaylistPage';
import AlbumPage from '../AlbumPage/Album';
import ArtistPage from '../ArtistPage';

class EditingPlaylist extends Component {
    state = {
        items: [],
        name: '',
        coverURL: null
    }

    componentDidMount() {
        this.updatePlaylist()
    }

    updatePlaylist = async () => {
        const accessToken = JSON.parse(localStorage.getItem('token'))
        const playlistId = this.props.playlistId ? this.props.playlistId : this.props.match.params.playlistId;
        const BASE_URL = `https://api.spotify.com/v1/playlists/${playlistId}`
        let playlistResponse = await fetch(BASE_URL, {
            headers: { 'Authorization': 'Bearer ' + accessToken },
            method: 'GET'
        })
        let playlistResult = await playlistResponse.json()

        this.setState({
            items: playlistResult.tracks ? playlistResult.tracks.items : [],
            name: playlistResult.name,
            coverURL: playlistResult?.images?.length > 0 ? playlistResult.images[0].url : ''
        })

        localStorage.setItem(`playlist${playlistId}`, JSON.stringify(playlistResult))
    }

    render() {
        const pathname = this.props.match.url
        const playlistId = this.props.match.params.playlistId;
        const { items, name, coverURL } = this.state
        return (
            <div className="editing">
                <div className="left">
                    <Switch>
                        <Route path={`${pathname}/album/:albumId`} render={
                            (props) => <AlbumPage {...props} accessToken={this.props.accessToken} playlistId={playlistId} pathname={pathname} />} />
                        <Route path={`${pathname}/artist/:artistId`} render={
                            (props) => <ArtistPage {...props} accessToken={this.props.accessToken} playlistId={playlistId} pathname={pathname} />} />
                        <Route path={pathname} render={(props) =>
                            <Searchbar {...props} playlistId={playlistId}
                                accessToken={this.props.accessToken}
                                match={this.props.match} />} />
                    </Switch>
                </div>
                <div className="right">
                    <PlaylistPage accessToken={this.props.accessToken}
                        match={this.props.match}
                        showEditing={false}
                        items={items}
                        name={name}
                        coverURL={coverURL}
                    />
                </div>
            </div>
        );
    }
}

export default withRouter(EditingPlaylist);