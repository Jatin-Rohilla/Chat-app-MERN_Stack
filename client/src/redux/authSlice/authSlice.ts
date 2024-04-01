import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import Cookies from "js-cookie"


export interface AuthState {
    name:string,
    _id:string,
    isAuth:boolean,
    avatar:string
}

// const initialState: AuthState = {
//     name : Cookies.get("name")||"", 
//     isAuth : Cookies.get("name")?true:false, 
//     _id : Cookies.get("userId")||"",
//     avatar:Cookies.get("avatar")||""
// }
const initialState: AuthState = {
    name : "", 
    isAuth : false, 
    _id : "",
    avatar:""
}

const authSlice = createSlice({
    name:"auth", 
    initialState, 
    reducers:{
        login:(state,action: PayloadAction<any>)=>{
            state.name = action.payload.name
            state._id = action.payload.userId
            state.avatar=action.payload.avatar
            state.isAuth = true
        },
        // login:(state)=>{
        //     state.name = Cookies.get("name")||""
        //     state._id = Cookies.get("userId")||""
        //     state.avatar=Cookies.get("avatar")||""
        //     state.isAuth = true
        // },
        logout:(state)=>{
            state.name = ""
            state._id = ""
            state.avatar=""
            state.isAuth = false
        }
    }
})

export const {login, logout} = authSlice.actions;

export default authSlice.reducer