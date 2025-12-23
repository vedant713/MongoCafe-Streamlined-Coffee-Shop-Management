
import matplotlib.pyplot as plt
from datetime import date, datetime
import numpy as np
import sys
import os
import re
from reportlab.platypus import SimpleDocTemplate, Table, Paragraph, TableStyle
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from tkinter import messagebox 
from time import strftime
from tkcalendar import Calendar
import pymongo
myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["coffeeshop"]

try:
    import Tkinter as tk
except ImportError:
    import tkinter as tk

try:
    import ttk
    py3 = False
except ImportError:
    import tkinter.ttk as ttk
    py3 = True

def set_Tk_var():
    global namesub
    namesub = tk.StringVar()
    global phonesub
    phonesub = tk.IntVar()
    global emailsub
    emailsub = tk.StringVar()
    global agesub
    agesub = tk.IntVar()
    global cage
    cage = tk.IntVar()
    global scustomer
    scustomer = tk.StringVar()
    global scombobox
    scombobox = tk.StringVar()
    global secombobox
    secombobox = tk.StringVar()
    global semployee
    semployee = tk.StringVar()
    global infophone
    infophone = tk.StringVar()
    global infoage
    infoage = tk.StringVar()
    global ownerid
    ownerid = tk.StringVar()
    global ownerpassword
    ownerpassword = tk.StringVar()
    global costlatte
    costlatte = tk.StringVar()
    global costcapp
    costcapp = tk.StringVar()
    global costvcapp
    costvcapp = tk.StringVar()
    global costlovesp
    costlovesp = tk.StringVar()
    global costmocha
    costmocha = tk.StringVar()
    global costethio
    costethio = tk.StringVar()
    global costicapp
    costicapp = tk.StringVar()
    global costblackcoffee
    costblackcoffee = tk.StringVar()
    global cname
    cname = tk.StringVar()
    global cphoneno
    cphoneno = tk.IntVar()
    global Cemail
    Cemail = tk.StringVar()
    global Ccombobox
    Ccombobox = tk.StringVar()
    global combocategory
    combocategory = tk.StringVar()
    global cheoffer
    cheoffer = tk.IntVar()
    global infoname
    infoname = tk.StringVar()
    global infophoneno
    infophoneno = tk.StringVar()
    global infoemail
    infoemail = tk.StringVar()
    global selectedButton
    selectedButton = tk.IntVar()
    global iname
    iname = tk.StringVar()
    global istock
    istock = tk.IntVar()
    global icombobox
    icombobox = tk.StringVar()
    global manageid
    manageid = tk.StringVar()
    global password
    password = tk.StringVar()
    global ename
    ename = tk.StringVar()
    global ephoneno
    ephoneno = tk.IntVar()
    global eage
    eage = tk.IntVar()
    global esalary
    esalary = tk.DoubleVar()
    global Eemail
    Eemail = tk.StringVar()
    global combobox
    combobox = tk.StringVar()
    global lattevar
    lattevar = tk.IntVar()
    global cappvar
    cappvar = tk.IntVar()
    global vanillavar
    vanillavar = tk.IntVar()
    global lovespvar
    lovespvar = tk.IntVar()
    global mochavar
    mochavar = tk.IntVar()
    global ethiovar
    ethiovar = tk.IntVar()
    global irishvar
    irishvar = tk.IntVar()
    global blackvar
    blackvar = tk.IntVar()

def init(top, gui, *args, **kwargs):
    global w, top_level, root
    w = gui
    top_level = top
    root = top
    time()
    displaycalender()
    hidetabs()
    refreshhome()
    setprices()
    setowneridpass()
    setmanageridpass()
    
    
def subtotal():
    mycol=mydb["prices"]
    x=mycol.find_one()
    l=[cappvar.get()*int(x['capp']),
    lattevar.get()*int(x['latte']),
    vanillavar.get()*int(x['vcapp']),
    mochavar.get()*int(x['mocha']),
    ethiovar.get()*int(x['ethio']),
    irishvar.get()*int(x['irish']),
    blackvar.get()*int(x['black']),
    lovespvar.get()*int(x['lovesp'])]
    stotal=sum(l)
    return(str(stotal))

def receiptGenerate():
    mycol=mydb["prices"]
    x=mycol.find_one()
    DATA = [
    [ "Item","Quantity","Price","Total" ],
    [
        "Cappuccino",
        str(cappvar.get()),
        x['capp']+'/-',
        str(cappvar.get()*int(x['capp']))+"/-"    #First multiplying the price and quantity then converting to string  
    ],
    [
        "Latte",
        str(lattevar.get()),
        x['latte']+'/-',
        str(lattevar.get()*int(x['latte']))+"/-"      
    ],
    [
        "Vanilla Cappuccino",
        str(vanillavar.get()),
        x['vcapp']+'/-',
        str(vanillavar.get()*int(x['vcapp']))+"/-"      
    ],
    [
        "Mocha",
        str(mochavar.get()),
        x['mocha']+'/-',
        str(mochavar.get()*int(x['mocha']))+"/-"      
    ],
    [
        "Ethiopian",
        str(ethiovar.get()),
        x['ethio']+'/-',
        str(ethiovar.get()*int(x['ethio']))+"/-"      
    ],
    [
        "Irish Coffee",
        str(irishvar.get()),
        x['irish']+'/-',
        str(irishvar.get()*int(x['irish']))+"/-"      
    ],
    [
        "Black Coffee",
        str(blackvar.get()),
        x['black']+'/-',
        str(blackvar.get()*int(x['black']))+"/-"      
    ],
    [
        "Love Special",
        str(lovespvar.get()),
        x['lovesp']+'/-',
        str(lovespvar.get()*int(x['lovesp']))+"/-"      
    ],
    [
        "Total",
        "",
        "",
        subtotal()
    ]
    ]
    pdf = SimpleDocTemplate( "receipt.pdf" , pagesize = A4 )
    styles = getSampleStyleSheet()
    title_style = styles[ "Heading1" ]
    title_style.alignment = 1
    title = Paragraph( "Receipt" , title_style )
    style = TableStyle(
        [
            ( "BOX" , ( 0, 0 ), ( -1, -1 ), 1 , colors.black ),
            ( "GRID" , ( 0, 0 ), ( 8 , 8 ), 1 , colors.black ),
            ( "BACKGROUND" , ( 0, 0 ), ( 3, 0 ), colors.gray ),
            ( "TEXTCOLOR" , ( 0, 0 ), ( -1, 0 ), colors.whitesmoke ),
            ( "ALIGN" , ( 0, 0 ), ( -1, -1 ), "CENTER" ),
            ( "BACKGROUND" , ( 0 , 1 ) , ( -1 , -1 ), colors.beige ),
        ]
    )
    table = Table( DATA , style = style )
    pdf.build([ title , table ])
    os.popen('receipt.pdf')

    

def displaycalender():
    global cal
    cal = Calendar(w.TNotebook1_summary,width=30,bg="darkblue",fg="white",year=2021)
    cal.place(relx=0.320, rely=0.274, height=284, width=350)
    cal.configure(state="normal",font="-family {Yu Gothic UI Semibold} -size 13 -weight bold")
def profittracker():
    mycol1=mydb["profit"]
    mycol2=mydb["prices"]
    d=str(datetime.today())[:10]
    x=mycol2.find_one()
    p=[x['capp'],x['latte'],x['vcapp'],x['mocha'],x['ethio'],x['irish'],x['black'],x['lovesp']]
    countitem=[cappvar.get(),lattevar.get(),vanillavar.get(),mochavar.get(),ethiovar.get(),irishvar.get(),blackvar.get(),lovespvar.get()]
    res=[]
    for i in range(len(p)):
        res.append(int(p[i])*countitem[i])
    total=float(sum(res))
    if(mycol1.find({"createdAt":d}).count()==0):
        mycol1.insert({"createdAt":d,"total":total})
    elif(mycol1.find({"createdAt":d}).count()==1):
        z=mycol1.find_one({"createdAt":d})
        newtotal=total+z['total']
        mycol1.update(z,{"createdAt":d,"total":newtotal})

def orderplace():
    global y
    l=[cappvar.get(),lattevar.get(),vanillavar.get(),mochavar.get(),ethiovar.get(),irishvar.get(),blackvar.get(),lovespvar.get()]
    mycol=mydb["mostorders"]
    if(l.count(0)==8):
        messagebox.showerror('Order not placed',"Please select atleast one item...")
    else:
        messagebox.showinfo('Success!',"Your order is placed successfully!")
        ans=messagebox.askyesno('',"Do you want receipt?")
        if(ans==True):
            receiptGenerate()
        w.TNotebook1.tab(8,state="normal")
        profittracker()    
        x=str(datetime.today())[:10]
        if(mycol.find({"createdAt":x}).count()==0):
            mycol.insert({"createdAt":x,"capp":l[0],"latte":l[1],"vcapp":l[2],"mocha":l[3],"ethio":l[4],"irish":l[5],"black":l[6],"lovesp":l[7]})
        elif(mycol.find({"createdAt":x}).count()==1):
            z=mycol.find_one({"createdAt":x})
            y=[z['capp']+l[0],z['latte']+l[1],z['vcapp']+l[2]
                ,z['mocha']+l[3],z['ethio']+l[4],z['irish']+l[5]
                ,z['black']+l[6],z['lovesp']+l[7]]
            mycol.update(z,{'createdAt':x,'capp':y[0],'latte':y[1],'vcapp':y[2],'mocha':y[3],'ethio':y[4],'irish':y[5],'black':y[6],'lovesp':y[7]})
                    
def decrease(value):
    if(value<=0):
        value=1
    value-=1
    return(value)

def latteinc(t): #Quantity incrementer/decrementer function
    if(t=="latte"):
        lattevar.set(lattevar.get()+1)
    if(t=="capp"):
        cappvar.set(cappvar.get()+1)
    if(t=="mocha"):
        mochavar.set(mochavar.get()+1)
    if(t=="vancapp"):
        vanillavar.set(vanillavar.get()+1)
    if(t=="lovesp"):
        lovespvar.set(lovespvar.get()+1)
    if(t=="etho"):
        ethiovar.set(ethiovar.get()+1)
    if(t=="irish"):
        irishvar.set(irishvar.get()+1)
    if(t=="black"):
        blackvar.set(blackvar.get()+1)
    if(t=="dlatte"):
        lattevar.set(decrease(lattevar.get()))
    if(t=="dcapp"):
        cappvar.set(decrease(cappvar.get()))
    if(t=="dmocha"):
        mochavar.set(decrease(mochavar.get()))
    if(t=="dvancapp"):
        vanillavar.set(decrease(vanillavar.get()))
    if(t=="dlovesp"):
        lovespvar.set(decrease(lovespvar.get()))
    if(t=="detho"):
        ethiovar.set(decrease(ethiovar.get()))
    if(t=="dirish"):
        irishvar.set(decrease(irishvar.get()))
    if(t=="dblack"):
        blackvar.set(decrease(blackvar.get()))

def time():
    string = strftime('%H:%M:%S %p')
    w.displaytime.configure(text = string)
    w.displaytime.after(1000, time)
    w.Labelsummarydate.configure(text=date.today())

def mostorder():
    print('coffeemanagementsystem_support.mostorder')
    sys.stdout.flush()

def generatemostorder():
    mycol=mydb["mostorders"]
    reqDate=str(cal.selection_get())
    if(mycol.find({"createdAt":reqDate}).count()==1):
        x=mycol.find_one({"createdAt":reqDate})
        y=[x['capp'],x['latte'],x['vcapp']
                ,x['mocha'],x['ethio'],x['irish']
                ,x['black'],x['lovesp']]
        cappuccino,latte,vcapp,m,e,i,black,lovespecial=y[0],y[1],y[2],y[3],y[4],y[5],y[6],y[7]
        arr=[latte,black,lovespecial,cappuccino,vcapp,e,i,m]
        mylabels=["Cappuccino","Latte","V.Cappuccino","Mocha","Ethiopian","I.Cappuccino","Black Coffee","LoveSpecial"]
        z = np.arange(len(arr))
        fig, ax = plt.subplots()
        ax.barh(z, y)
        ax.set_yticks(z)
        ax.set_yticklabels(mylabels)
        ax.bar_label(ax.containers[0])
        #plt.bar(mylabels,arr)
        plt.show()
    else:
        messagebox.showerror('',"Selected date data does not exists")    
    
    
    
####EMPLOYEE FUNCTIONS####
def adddetailsemp():
    mycol=mydb["employee"]
    if(len(str(ephoneno.get()))!=10):
        messagebox.showerror('',"Please enter 10 digits number")
    elif(eage.get()==0):
        messagebox.showerror('',"Invalid age!")
    else:
        mydict={"name":ename.get(),
        "age":eage.get(),
        "Salary":esalary.get(),
        "Phoneno":ephoneno.get(),
        "email":Eemail.get()+combobox.get(),
        "Category":combocategory.get()}
        if(mycol.find(mydict).count()==1):
            messagebox.showerror('',"Data already present in database!")
        else:
            x = mycol.insert_one(mydict)
            deleteentry()
            refreshhome()
        
def viewempdetails():
    mycol=mydb["employee"]  
    w.Scrolledtreeviewupdate.delete(*w.Scrolledtreeviewupdate.get_children())
    w.Scrolledtreeviewdelete.delete(*w.Scrolledtreeviewdelete.get_children())
    w.Scrolledtreesviewdetails.delete(*w.Scrolledtreesviewdetails.get_children())
    for x in mycol.find():
        x=list(x.values())
        w.Scrolledtreeviewupdate.insert(parent='',index=0,values=(x[1],x[2],x[4],x[3],x[5],x[6]))
        w.Scrolledtreeviewdelete.insert(parent='',index=0,values=(x[1],x[2],x[4],x[3],x[5],x[6]))
        w.Scrolledtreesviewdetails.insert(parent='',index=0,values=(x[1],x[2],x[4],x[3],x[5],x[6]))
def removeall():
    mycol=mydb["employee"]
    ans=messagebox.askyesno('',"Do you want to delete all data?")
    if(ans==True):
        mycol.remove()
        refreshhome()
        viewempdetails()
        messagebox.showinfo('',"All data deleted successfully")

def removeselected():   
    mycol=mydb["employee"]
    if(w.Scrolledtreeviewdelete.focus()==""):
        messagebox.showerror('',"No item is selected!")
    else:
        if(mycol.find().count()!=0):
            curItem = w.Scrolledtreeviewdelete.focus()
            x=w.Scrolledtreeviewdelete.item(curItem)["values"][0:6]
            mycol.remove({'name':x[0],'age':x[1],'Salary':float(x[3]),'Phoneno':x[2],'email':x[4],'Category':x[5]})
            viewempdetails()
            refreshhome()
        else:
            messagebox.showerror('',"No element to delete!")       
        
def updaterecord():
    mycol=mydb["employee"]
    curItem = w.Scrolledtreeviewupdate.focus()
    x=w.Scrolledtreeviewupdate.item(curItem)["values"][0:6]
    y=[ename.get(),eage.get(),esalary.get(),ephoneno.get(),Eemail.get()+combobox.get(),combocategory.get()]
    if(w.Scrolledtreeviewupdate.focus()==""):
        messagebox.showerror("","Please select the item to update")
    elif(len(str(y[3]))!=10):
        messagebox.showerror('',"Please enter 10 digits phone number!")
    elif(y[1]==0):
        messagebox.showerror('',"Age cannot be zero")
    else:
        myquery={'name':x[0],'age':x[1],'Salary':float(x[3]),'Phoneno':x[2],'email':x[4],'Category':x[5]}
        newvalues={"$set":{'name':y[0],'age':y[1],'Salary':y[2],'Phoneno':y[3],'email':y[4],'Category':y[5]}}
        mycol.update(myquery,newvalues)
        deleteentry()
        viewempdetails()    

def deleteentry():
    w.Entryname.delete(0,tk.END)
    w.Entryphone.delete(0,tk.END)
    w.Entryage.delete(0,tk.END)
    w.Entrysalary.delete(0,tk.END)
    w.Entryemail.delete(0,tk.END)
    w.Comboemails.delete(0,tk.END)
    w.Entrysalary_2.delete(0,tk.END)
    w.Entryphone_2.delete(0,tk.END)
    w.Entryage_2.delete(0,tk.END)
    w.Entryemail_2.delete(0,tk.END)
    w.Combocategoryu.delete(0,tk.END)

####EMPLOYEE FUNCTIONS####
def deleteentrycus():
    w.EntryCname.delete(0,tk.END)
    w.EntryCphone.delete(0,tk.END)
    w.EntryCage.delete(0,tk.END)
    w.EntryCemail.delete(0,tk.END)
    w.Comboemails_1.delete(0,tk.END)
    w.EntryCname_2.delete(0,tk.END)
    w.EntryCphone_2.delete(0,tk.END)
    w.EntryCage_2.delete(0,tk.END)
    w.ComboCemailsu.delete(0,tk.END)

    
    
####LOGIN/LOGOUT####
def submitaccess():
    mycol=mydb["loginmanager"]
    if(mycol.find({"managerid":manageid.get(),"password":password.get()}).count()!=0):
        for i in range(0,7):
            if(i==4 or i==1):
                w.TNotebook1.tab(i,state="hidden")
            else:
                w.TNotebook1.tab(i,state="normal")
        messagebox.showinfo('',"Login success!")
    else:
        messagebox.showerror('',"Incorrect ID or password")
def setowneridpass():
    mycol=mydb["loginowner"]
    if(mycol.find().count()==0):
        mycol.insert({"ownerid":"1005","password":"5001"})
        
def setmanageridpass():
    mycol=mydb["loginmanager"]
    if(mycol.find().count()==0):
        mycol.insert({"managerid":"9113","password":"12345"})
def logout():
    ans=messagebox.askquestion('',"Do you want to logout?")
    if(ans=='yes'):
        w.TNotebook1.tab(10,state="normal")
        hidetabs()
        
####LOGIN/LOGOUT####
def hidetabs():
    for i in range(0,10):
        w.TNotebook1.tab(i,state="hidden")
####HOME TAB FUNCTIONS####
def refreshhome():
    mycol1=mydb["employee"]
    mycol2=mydb["customer"]
    x=mycol1.find().count()
    y=mycol2.find().count()
    w.empcount.configure(text=str(x))
    w.customercount.configure(text=str(y))
####HOME TAB FUNCTIONS####

    
 
####INGREDEINTS FUNCTIONS####
def addingre():
    mycol=mydb["ingredients"]
    mydict={'name':iname.get(),'stock':istock.get(),'Unit':icombobox.get()}
    if(mycol.find(mydict).count()==1):
        messagebox.showerror('',"Data already present in database!")
    else:
        mycol.insert_one(mydict)
        displayigre()
        
def delingre():
    mycol=mydb["ingredients"]
    if(mycol.find().count()!=0):
        if(w.Scrolledtreeviewingre.focus()==""):
            messagebox.showerror('',"Please select one item")
        elif(mycol.find().count()!=0):
            curItem = w.Scrolledtreeviewingre.focus()
            x=w.Scrolledtreeviewingre.item(curItem)["values"][0:3]
            mycol.remove({'name':x[0],'stock':x[1],'Unit':x[2]})
            displayigre()
    else:
        messagebox.showerror('',"No data present!")
def delallingre():
    mycol=mydb["ingredients"]
    ans=messagebox.askyesno('',"Do you want to delete all data?")
    if(ans==True):
        mycol.remove()
        displayigre()
        messagebox.showinfo('',"All data deleted successfully")
    
def updateingre():
    mycol=mydb["ingredients"]
    try:
        curItem = w.Scrolledtreeviewingre.focus()
        print(curItem)
        x=w.Scrolledtreeviewingre.item(curItem)["values"][0:3]
        y=[iname.get(),istock.get(),icombobox.get()]
        myquery={'name':x[0],'stock':x[1],'Unit':x[2]}
        newvalues={"$set":{'name':y[0],'stock':y[1],'Unit':y[2]}}
        mycol.update(myquery,newvalues)
        displayigre()
    except:
        messagebox.showerror('','Please select a particular item!')
def viewingre():
    displayigre()

def displayigre():
    mycol=mydb["ingredients"]
    w.Scrolledtreeviewingre.delete(*w.Scrolledtreeviewingre.get_children())       
    if(mycol.find().count()!=0):
        for x in mycol.find():
            x=list(x.values())
            w.Scrolledtreeviewingre.insert(parent='',index=0,values=(x[1],x[2],x[3]))
    
####INGREDEINTS FUNCTIONS####
def continuea():
    print('coffeemanagementsystem_support.continuea')
    sys.stdout.flush()

def customeredirect():
    w.TNotebook1.tab(4,state="normal")
    w.TNotebook1.tab(10,state="hidden")
def manageredirect():
    w.TNotebook1.tab(1,state="normal")
    w.TNotebook1.tab(10,state="hidden")

def backtomm():
    s=w.TNotebook1.tab(0)["state"]
    if(s=="normal"):
        ans=messagebox.askquestion('',"Do you want to logout?")
        if(ans=='yes'):
            w.TNotebook1.tab(10,state="normal")
            hidetabs()
    else:
        w.TNotebook1.tab(10,state="normal")
        hidetabs()
    
def submitinfo():
    mycol=mydb["customer"]
    mydict={"Name":namesub.get(),
    "Phone":phonesub.get(),
    "Age":agesub.get(),
    "Email":emailsub.get()
    }
    if(mycol.find(mydict).count()==1):
        messagebox.showerror('',"You have already submitted the form!")
    elif(len(str(phonesub.get()))!=10):
        messagebox.showerror('',"Please enter 10 digit phone number")
    elif(agesub.get()==0):
        messagebox.showerror('',"Age cannot be zero!")
    else:
        x = mycol.insert_one(mydict)
        refreshhome()
        messagebox.showinfo('',"Form is been submitted successfully!")
    

def Cremoveall():
    mycol=mydb["customer"]
    ans=messagebox.askyesno('',"Do you want to delete all data?")
    if(ans==True):
        mycol.remove()
        refreshhome()
        viewcusdetails()
        messagebox.showinfo('',"All data deleted successfully")
def removeCselected():
    mycol=mydb["customer"] 
    if(w.ScrolledCtreeviewdelete.focus()==""):
        messagebox.showerror('',"No item is selected!")
    else:
        if(mycol.find().count()!=0):
            curItem = w.ScrolledCtreeviewdelete.focus()
            x=w.ScrolledCtreeviewdelete.item(curItem)["values"][0:4]
            mycol.remove({'Name':x[0],'Phone':x[1],'Age':x[2],'Email':x[3]})
            viewcusdetails()
            refreshhome()
        else:
            messagebox.showerror('',"No element to delete!")

def viewcusdetails():
    mycol=mydb["customer"]  
    w.ScrolledCtreeviewupdate.delete(*w.ScrolledCtreeviewupdate.get_children())
    w.ScrolledCtreeviewdelete.delete(*w.ScrolledCtreeviewdelete.get_children())
    w.ScrolledCtreeviewdetails.delete(*w.ScrolledCtreeviewdetails.get_children())
    for x in mycol.find():
        x=list(x.values())
        w.ScrolledCtreeviewupdate.insert(parent='',index=0,values=(x[1],x[2],x[3],x[4]))
        w.ScrolledCtreeviewdelete.insert(parent='',index=0,values=(x[1],x[2],x[3],x[4]))
        w.ScrolledCtreeviewdetails.insert(parent='',index=0,values=(x[1],x[2],x[3],x[4]))
def adddetailscus():
    mycol=mydb["customer"]
    if(cphoneno.get()=="" or cage.get()=="" or cname.get()=="" or Cemail.get()==""):
        messagebox.showerror('',"Field cannot be blank")
    elif(len(str(cphoneno.get()))!=10):
        messagebox.showerror('',"Please enter 10 digits number")
    elif(cage.get()==0):
        messagebox.showerror('',"Invalid age!")
    else:
        mydict={"Name":cname.get(),
        "Phone":cphoneno.get(),
        "Age":cage.get(),
        "Email":Cemail.get()+combobox.get(),
        }
        if(mycol.find(mydict).count()==1):
            messagebox.showerror('',"Data already present in database!")
        else:
            x = mycol.insert_one(mydict)
            deleteentrycus()
            refreshhome()
    
def setprices():
    mycol=mydb["prices"]
    x=mycol.find_one()
    y=mycol.find().count()
    if(y==0):
        mycol.insert({"capp":"0",
                    "latte":"0",
                    "vcapp":"0",
                    "mocha":"0",
                    "ethio":"0",
                    "irish":"0",
                    "black":"0",
                    "lovesp":"0"})
        setprices()
    else:
        x=list(x.values())
        costcapp.set(x[1])
        costlatte.set(x[2])
        costvcapp.set(x[3])
        costmocha.set(x[4])
        costethio.set(x[5])
        costicapp.set(x[6])
        costblackcoffee.set(x[7])
        costlovesp.set(x[8])
        
    

def saveprice():
    mycol=mydb["prices"]
    c=mycol.find().count()
    if(c==0):
        costlatte.set(w.Entrypricelatte.get())
        costcapp.set(w.Entrypricecapp.get())
        costethio.set(w.Entrypriceethio.get())
        costblackcoffee.set(w.Entrypriceblack.get())
        costlovesp.set(w.Entrypricelovesp.get())
        costicapp.set(w.Entrypriceicapp.get())
        costmocha.set(w.Entrypricemocha.get())
        costvcapp.set(w.Entrypricevcapp.get())
        mycol.insert({"capp":w.Entrypricecapp.get(),
                    "latte":w.Entrypricelatte.get(),
                    "vcapp":w.Entrypricevcapp.get(),
                    "mocha":w.Entrypricemocha.get(),
                    "ethio":w.Entrypriceethio.get(),
                    "irish":w.Entrypriceicapp.get(),
                    "black":w.Entrypriceblack.get(),
                    "lovesp":w.Entrypricelovesp.get()})
        messagebox.showinfo('',"Prices saved successfully!")
        
    else:
        mycol.remove()
        saveprice()

def ownerredirect():
    w.TNotebook1.tab(9,state="normal")
    w.TNotebook1.tab(10,state="hidden")

def submitowneraccess():
    mycol=mydb["loginowner"]
    if(mycol.find({"ownerid":ownerid.get(),"password":ownerpassword.get()}).count()!=0):
        for i in range(0,10):
            if(i==1 or i==4 or i==8 or i==9):
                w.TNotebook1.tab(i,state="hidden")
            else:
                w.TNotebook1.tab(i,state="normal")
        messagebox.showinfo('',"Login success!")
    else:
        messagebox.showerror('',"Incorrect ID or Password!")
def get_data(ev):
    r=w.Scrolledtreeviewupdate.focus()
    content=w.Scrolledtreeviewupdate.item(r)
    row=content["values"]
    print(row)
    
    
def generatetotalprofit():
    reqDate=str(cal.selection_get())
    mycol=mydb["profit"]
    if(mycol.find({"createdAt":reqDate}).count()==0):
        w.Labeltpg.configure(text="")
        messagebox.showerror("","Selected date data doesnt exists")
    elif(mycol.find({"createdAt":reqDate}).count()==1):
        x=mycol.find_one({"createdAt":reqDate})
        w.Labeltpg.configure(text=f"Total Profit Generated:₹{x['total']}")

def searchcustomer():
    mycol=mydb["customer"]
    w.ScrolledCtreeviewdetails.delete(*w.ScrolledCtreeviewdetails.get_children())
    if(scustomer.get()==""):
            messagebox.showerror("","Please Enter data")
    if(scombobox.get()=="Name"):
        if(mycol.find({"Name":re.compile('^' + scustomer.get() + '$', re.IGNORECASE)}).count()!=0):
            for x in mycol.find({"Name":re.compile('^' + scustomer.get() + '$', re.IGNORECASE)}):
                x=list(x.values())
                w.ScrolledCtreeviewdetails.insert(parent='',index=0,values=(x[1],x[2],x[3],x[4]))
        else:
            messagebox.showerror('',"Data record does not exists!")
    if(scombobox.get()=="PhoneNo"):
        if(scustomer.get().isdigit()):
            if(mycol.find({"Phone":int(scustomer.get())}).count()!=0):
                for x in mycol.find({"Phone":int(scustomer.get())}):
                    x=list(x.values())
                    w.ScrolledCtreeviewdetails.insert(parent='',index=0,values=(x[1],x[2],x[3],x[4]))
            else:
                messagebox.showerror('',"Data record does not exists!")
        else:
            messagebox.showerror('',"Please enter only digits!")
    if(scombobox.get()=="Email"):
        if(mycol.find({"Email":re.compile('^' + scustomer.get() + '$', re.IGNORECASE)}).count()!=0):
            for x in mycol.find({"Email":re.compile('^' + scustomer.get() + '$', re.IGNORECASE)}):
                x=list(x.values())
                w.ScrolledCtreeviewdetails.insert(parent='',index=0,values=(x[1],x[2],x[3],x[4]))
        else:
            messagebox.showerror('',"Data record does not exists!")    

def searchemployee(): 
    mycol=mydb["employee"]
    w.Scrolledtreesviewdetails.delete(*w.Scrolledtreesviewdetails.get_children())
    if(semployee.get()==""):
            messagebox.showerror("","Please Enter data")
    if(secombobox.get()=="Name"):
        if(mycol.find({"name":re.compile('^' + semployee.get() + '$', re.IGNORECASE)}).count()!=0):
            for x in mycol.find({"name":re.compile('^' + semployee.get() + '$', re.IGNORECASE)}):
                x=list(x.values())
                w.Scrolledtreesviewdetails.insert(parent='',index=0,values=(x[1],x[2],x[4],x[3],x[5],x[6]))
        else:
            messagebox.showerror('',"Data record does not exists!")
    if(secombobox.get()=="PhoneNo"):
        if(semployee.get().isdigit()):
            if(mycol.find({"Phoneno":int(semployee.get())}).count()!=0):
                for x in mycol.find({"Phoneno":int(semployee.get())}):
                    x=list(x.values())
                    w.Scrolledtreesviewdetails.insert(parent='',index=0,values=(x[1],x[2],x[4],x[3],x[5],x[6]))
            else:
                messagebox.showerror('',"Data record does not exists!")
        else:
            messagebox.showerror('',"Please enter only digits")
    if(secombobox.get()=="Email"):
        if(mycol.find({"email":re.compile('^' + semployee.get() + '$', re.IGNORECASE)}).count()!=0):
            for x in mycol.find({"email":re.compile('^' + semployee.get() + '$', re.IGNORECASE)}):
                x=list(x.values())
                w.Scrolledtreesviewdetails.insert(parent='',index=0,values=(x[1],x[2],x[4],x[3],x[5],x[6]))
        else:
            messagebox.showerror('',"Data record does not exists!")    

def updaterecordcus():
    mycol=mydb["customer"]
    curItem = w.ScrolledCtreeviewupdate.focus()
    x=w.ScrolledCtreeviewupdate.item(curItem)["values"][0:4]
    y=[cname.get(),cphoneno.get(),cage.get(),Cemail.get()+Ccombobox.get()]
    if(w.ScrolledCtreeviewupdate.focus()==""):
        messagebox.showerror("","Please select the item to update")
    elif(len(str(y[1]))!=10):
        messagebox.showerror('',"Please enter 10 digits phone number!")
    elif(y[2]==0):
        messagebox.showerror('',"Age cannot be zero")
    else:
        myquery={'Name':x[0],'Phone':x[1],'Age':x[2],'Email':x[3]}
        newvalues={"$set":{'Name':y[0],'Phone':y[1],'Age':y[2],'Email':y[3]}}
        mycol.update(myquery,newvalues)
        deleteentrycus()
        viewcusdetails()    

def destroy_window():
    # Function which closes the window.
    global top_level
    top_level.destroy()
    top_level = None

if __name__ == '__main__':
    import coffeemanagementsystem
    coffeemanagementsystem.vp_start_gui()
    





