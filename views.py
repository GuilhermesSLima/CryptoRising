import requests

api_key = ''

headers = {'Authorization': api_key}

url = 'https://api.coinpaprika.com/v1/'
datatype = ''

datatype = input("Escreva 'global' para retorna métricas atuais de visão geral do mercado de criptomoedas e 'coins' etorna informações básicas sobre criptomoedas: ")
url_final = url + datatype
print(url_final)

if datatype == 'global': 
    response = requests.get(url_final, headers)
    data = response.json()
    print(data)
    print(data['market_cap_usd'])
elif datatype == 'coins':
    pesquisa_moeda = int(input("Digite '1' para pesquisa por id e '0' para listar todas as moedas: "))
    if pesquisa_moeda == 0:
        response = requests.get(url_final, headers)
        print("-"*100)
        print(response.json())
        print("-"*100)
        data = response.json()
        print(data)
    elif pesquisa_moeda == 1:
        id_moeda = input("Digite o id da moeda: ")
        url_final = url_final + '/' + id_moeda
        response = requests.get(url_final, headers)
        print("-"*100)
        print(response.json())
        print("-"*100)
        data = response.json()
        print(data)
