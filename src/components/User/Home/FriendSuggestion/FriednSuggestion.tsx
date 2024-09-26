import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/sotre';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
// import Stack from '@mui/material/Stack';
// import WorkIcon from '@mui/icons-material/Work';
// import BeachAccessIcon from '@mui/icons-material/BeachAccess';

const FriednSuggestion = () => {

    const useData = useSelector((state: RootState) => state.userAuth.userData);
    console.log(useData)
    return (
        <div style={{ backgroundColor: '#2d3748', height: '520px', width: '300px', margin: 10,marginTop:'-80%', borderRadius: '20px' }}>
            <div style={{ height: '80px', width: 'full', paddingTop: '20px', display: 'flex', flexDirection: 'row' }}>
                <Avatar
                    alt="Remy Sharp"
                    src={useData?.avatar}
                    sx={{ width: 56, height: 56, marginLeft: '10%', }}
                />
                <p style={{marginLeft:'10%',marginTop:'10px',color:'white'}}>{useData?.name}</p>
            </div>
            <hr style={{ color: 'black' }} />

            <h6 style={{ color: 'white', textAlign: 'center', }}>New to TravelMedia</h6>

            <div>
                <List sx={{ width: '100%', maxWidth: 360, }}>
                    {
                        [1, 2, 3, 4].map((val,index) => {
                            return (
                                <ListItem key={index} sx={{ paddingLeft: 6, gap: 2 }}>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <ImageIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText sx={{ color: 'white', overflow: 'hidden',cursor:'pointer' }} primary="usernames" secondary="Jan 9, 2014" tabIndex={val} />
                                    <ListItemText primary='follow' sx={{ color: 'blue', marginTop: '-5px',cursor:'pointer' }} />
                                </ListItem>
                            )
                        })
                    }


                </List>
            </div>
            <hr style={{ color: 'black' }} />
            <div style={{textAlign:'center'}}>
                <p style={{color:'darkbrown', cursor:'pointer'}}>@All rights reserved</p>
            </div>

        </div>
    )
}

export default FriednSuggestion
