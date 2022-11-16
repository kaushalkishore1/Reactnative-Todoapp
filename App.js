import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput,FlatList,TouchableOpacity,Alert, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MaterialIcons } from '@expo/vector-icons'; 
import React from 'react';

const COLORS = {primary: '#1f145c', white: '#fff', textcolor: '#1F85DE'};


const App = () => {
  const[todos,setTodos] = React.useState([]);
  const [textInput, setTextInput] = React.useState('');

  React.useEffect(()=> {
    getTodosfromUseDevice();
  },[]);
  React.useEffect(()=> {
    saveTodotoUseDevice(todos);
  },[todos]);

  const addTodo = () => {
    if(textInput == ''){
       Alert.alert('Error','Please input todo');
    }else {
        const newTodo = {
          id: Math.random(),
          task: textInput,
          completed: false,
        };
        setTodos([...todos,newTodo]);
        setTextInput('');
    }
  };

  const saveTodotoUseDevice = async todos => {
    try {
      const stringifyTodos = JSON.stringify(todos);
      await AsyncStorage.setItem('todos',stringifyTodos);
    } catch (error) {
      console.log(error);
    }
  };

  const getTodosfromUseDevice = async () =>{
    try {
      const todos = await AsyncStorage.getItem('todos');
      if(todos != null){
        setTodos(JSON.parse(todos));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const markTodosComplete = todoId => {
    const newTodoItem = todos.map(item => {
      if(item.id = todoId){
        return {...item,completed: true}
      }
      return item;
    });
    setTodos(newTodoItem);
  };

  const deleteTodo = todoId => {
    Alert.alert('Confirm', 'Clear todos?',[
      {
        text:'Yes',
        onPress: () => setTodos([]),
      },
      {
        text: 'No',
      },
    ]);
  };

  const clearAllTodos = () => {
    Alert.alert('Confirm', 'Clear todos?',[{
      text: 'Yes',
      onPress: () => setTodos([]),
    },
    {
     text: 'No',
    },
  ]);
  };

  const ListItem = ({todo}) => {
    return (
      <View style={styles.listItem}>
        <View style={{flex: 1}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 15,
              color: COLORS.primary,
              textDecorationLine: todo?.completed ? 'line-through' : 'none',
            }}>
            {todo?.task}
          </Text>
        </View>
        {!todo?.completed && (
          <TouchableOpacity onPress={() => markTodoComplete(todo.id)}>
            <View style={[styles.actionIcon, {backgroundColor: 'green'}]}>
              <MaterialIcons name="done" size={20} color="white" />
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
          <View style={styles.actionIcon}>
            <MaterialIcons name="delete" size={20} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    );
  };



  return (
   <SafeAreaView style={{flex: 1, backgroundColor: '#1fdede'}}>
    <View style={styles.header}>
    <Text style={{fontWeight: 'bold', fontSize: 20, color: COLORS.primary}}>TODO APP</Text>
    <MaterialIcons name='delete' size={25} color='red' onPress={clearAllTodos}/>
    </View>
    <FlatList 
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{padding: 20,paddingBottom: 100}}
    data={todos}
    renderItem={({item}) => <ListItem todo={item}/>}
    />
    <View style={styles.footer}>
      <View style={styles.inputContainer}> 
       <TextInput value={textInput} placeholder="Add Todo" 
       onChangeText={text => setTextInput(text)}/>
      </View>
      <TouchableOpacity onPress={addTodo}>
        <View style={styles.ionContainer}>
          <MaterialIcons name='add' color='white' size={30}/>
        </View>
      </TouchableOpacity>
    </View>
   

   </SafeAreaView>
  ); 
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
   padding: 20,
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'space-between',
  },
  listItem: {
    padding: 20,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    elevation:12,
    borderRadius: 7,
    marginVertical: 10,
  },
  actionIcon: {
    height: 25,
    width: 25,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    borderRadius: 3,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
  },
  inputContainer: {
    height: 50,
    paddingHorizontal:20,
    elevation: 40,
    backgroundColor: COLORS.white,
    flex: 1,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 30,
  },
  ionContainer: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,
    elevation: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
