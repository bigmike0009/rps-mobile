import { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { StatusBar } from 'react-native';
import { FAB, useTheme } from 'react-native-paper';
import * as AuthSession from 'expo-auth-session';


WebBrowser.maybeCompleteAuthSession()


export default function FacebookButton() {
  const [user, setUser] = useState(null)
  const [request, response, promptAsync] = Facebook.useAuthRequest({
    clientId: '1119639173020972'
    //clientSecret: --
  })

  const { colors } = useTheme()
  
  useEffect(()=>{
    if(response && response.type === 'success' && response.authentication){
      (async () => {
        const userInfoResponse = await fetch(`https://graph.facebook.com/me?access_token=${response.authentication?.accessToken}&fields=id,name,picture.type(large)`)
        const userInfo = await userInfoResponse.json()
        console.log(userInfo)
        setUser(userInfo)
      })

    }
  },[response])

  const handlePressAsync = async () => {
    const result = await promptAsync()
    if (result.type !== 'success'){
      alert('Uh Oh, something went wrong.')
      return
    }
  }

  return (
    <FAB style ={{padding: 0, margin: 10, backgroundColor: colors.tertiary}}
              label="Sign In With Facebook" 
              onPress={() =>{handlePressAsync()}}
              >
        </FAB>
  )


}
