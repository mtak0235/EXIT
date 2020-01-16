import torch
from transformers import BertTokenizer, BertModel, AdamW, get_linear_schedule_with_warmup, BertPreTrainedModel
import pandas as pd
from tqdm import tqdm
from torch.nn.utils.rnn import pad_sequence
import torch.nn as nn

# 버트 분류기

class BertClassifier(nn.Module):
    
    def __init__(self, bert: BertModel, num_classes: int):
        super().__init__()
        self.bert = bert
        self.classifier = nn.Linear(bert.config.hidden_size, num_classes)
        
    def forward(self, input_ids, attention_mask=None, token_type_ids=None, position_ids=None, head_mask=None,
                
            labels=None):
        outputs = self.bert(input_ids,
                               attention_mask=attention_mask,
                               token_type_ids=token_type_ids,
                               position_ids=position_ids,
                               head_mask=head_mask)
        cls_output = outputs[1] # batch, hidden
        cls_output = self.classifier(cls_output) # batch, 6
        cls_output = torch.sigmoid(cls_output)
        criterion = nn.BCELoss()
        loss = 0
        if labels is not None:
            loss = criterion(cls_output, labels)
        return loss, cls_output

#토크나이저(글자 숫자화)

bert_model_name = 'bert-base-multilingual-cased'
tokenizer = BertTokenizer.from_pretrained(bert_model_name)
device=torch.device('cpu')

#모델 로드

model=torch.load("C:/Users/PC/bert/bmw_4.pt",map_location = torch.device ( 'cpu'))

#데이터 셋 읽고 답지 만들기


f=open("./route/result1.txt","r",encoding="utf-8")
data=f.read()
df1=pd.DataFrame(data={"user_name":["."],"text":[data]},columns=["user_name","text"])
df1.to_csv("./route/result.csv")

test_df = pd.read_csv("./route/result.csv")
test_df["library"]=0.5
test_df["restaurant"]=0.5
test_df["convience_store"]=0.5
test_df["cafe"]=0.5
test_df["cat"]=0.5
test_df.to_csv("./route/result_1.csv",mode="w",encoding="utf-8")

#데이셋 분류

BATCH_SIZE=32
test_df = pd.read_csv('./route/result.csv')
submission = pd.read_csv('./route/result_1.csv')
columns = ["library", "restaurant", "convience_store", "cafe", "cat"]
for i in tqdm(range(len(test_df) // BATCH_SIZE + 1)):
    batch_df = test_df.iloc[i * BATCH_SIZE: (i + 1) * BATCH_SIZE]
    assert (batch_df["user_name"] == submission["user_name"][i * BATCH_SIZE: (i + 1) * BATCH_SIZE]).all(), f"Id mismatch"
    texts = []
    for text in batch_df["text"].tolist():
        text = tokenizer.encode(text, add_special_tokens=True)
        if len(text) > 120:
            text = text[:119] + [tokenizer.sep_token_id]
        texts.append(torch.LongTensor(text))
    x = pad_sequence(texts, batch_first=True, padding_value=tokenizer.pad_token_id).to(device)
    mask = (x != tokenizer.pad_token_id).float().to(device)
    with torch.no_grad():
        _, outputs = model(x, attention_mask=mask)
    outputs = outputs.cpu().numpy()
    submission.iloc[i * BATCH_SIZE: (i + 1) * BATCH_SIZE][columns] = outputs

# 분류된 데이터 저장

submission.to_csv("./route/result_2.csv", index=False)

# 분류된 데이터 읽기

d2=pd.read_csv("./route/result_2.csv")

result=0
number=0
for i in range(4,9):
    if d2.iloc[0][i]>result:
        result=d2.iloc[0][i]
        number=i-3

# 분류된 데이터 출력
        
f=open("./route/result.txt","w")
f.write(str(number))
f.close()

