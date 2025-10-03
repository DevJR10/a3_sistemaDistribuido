import streamlit as st
import json
import requests

###########CODIGO DE EXECUCAO
###########python -m streamlit run front.py 

st.title("Sistema Consultas")


if "visibility" not in st.session_state:
    st.session_state.visibility = "visible"
    st.session_state.disabled = False
with st.empty():
    option= st.selectbox('What type of request you will perform?', ('Livro', 'consulta' , 'descricao'))

    st.write('')
    st.write('write the message you want to add')
#################################################
st.header("Livros")
st.subheader("CRIAR Livro")

text_input = st.text_input(
            "Texto do livro",
            label_visibility=st.session_state.visibility,
            disabled=st.session_state.disabled,
            placeholder="Exemplo: Alice no Pais das maravilhas"

        )

data_json = {'texto': text_input}

if st.button("Mandar Livro", type="primary"):
    url = 'http://localhost:4000/livros'
    print(data_json)
    r = requests.put(url, json=data_json)
    st.text(r.text)

#################################################
st.subheader("LER Livro")

data_json_ler_livro = {'texto': text_input}
if st.button("Consultar Livro", type="primary"):
    url = f'http://localhost:4000/livros'
    print(data_json)
    r = requests.get(url)
    st.text(r.text)




#################################################
st.header("Descricao")
st.subheader("CRIAR Descricao")
text_input_livro = st.text_input(
            "NUMERO do livro",
            label_visibility=st.session_state.visibility,
            disabled=st.session_state.disabled,
            placeholder="Exemplo: 1"

        )
text_input_descricao = st.text_input(
            "Texto da descricao",
            label_visibility=st.session_state.visibility,
            disabled=st.session_state.disabled,
            placeholder="Exemplo: acao, sci-fi , é um livro de acao e ficcao cienfifica"
        )

data_json_descricao = {'texto': text_input_descricao}

if st.button("Mandar Descricao", type="primary"):   
    url = f'http://localhost:5000/livros/{text_input_livro}/descricoes'
    print(data_json)
    ##r = requests.put(url, json=data_json_descricao)
    ##st.text(r.text)

    rcheck = requests.get(url)   
    #r = requests.put(url, json=data_json_descricao)

    if rcheck.status_code == 200:
        try:
            datacheck = rcheck.json()  # Parse the JSON response
            if not datacheck:  # Check if the data is empty (i.e., {} or [])
                r = requests.put(url, json=data_json_descricao)
                st.text(r.text)
            else:
                st.text("Livro ja tem descricao")
        except ValueError:
            st.text("Response is not valid JSON.")
        

#################################################
st.subheader("Consultar Livro por ID")


text_input_descricao_consultar = st.text_input(
            "Numero",
            label_visibility=st.session_state.visibility,
            disabled=st.session_state.disabled,
            placeholder="Exemplo: 1"
        )

if st.button("Consultar Descricao", type="primary"):   
    url = f'http://localhost:5000/livros/{text_input_descricao_consultar}/descricoes'
    r = requests.get(url)

    url2 = f'http://localhost:6000/livros'
    r2 = requests.get(url2)

    
    st.text("Livro numero: " + text_input_descricao_consultar)
    st.text( r2.json()[f"{text_input_descricao_consultar}"]["texto"])
    contador_descricao = 0
    for item in r.json():
        contador_descricao += 1
        st.text( f"Descricao {contador_descricao}: " +  item["texto"])
        st.text( f"Tema {contador_descricao}: " +  item["status"])

#################################################

st.header("Consultar Todos Livros")
if st.button("Consultar", type="primary"):   
    url2 = f'http://localhost:6000/livros'
    r2 = requests.get(url2)
    st.text(r2.text)