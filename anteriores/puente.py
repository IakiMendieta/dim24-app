cos = np.cos
sin = np.sin
sqrt = np.sqrt
pi = 3.141592
alto = 2200
ancho = 2200

import datetime
import requests


def nuevo_registro(request):
    if request.method == 'POST':
        nvo_registro = NuevoRegistro(request.POST, request.FILES)
        if nvo_registro.is_valid():
            nvo_registro = nvo_registro.save(commit=False)
            print(dict(request.session))
            nvo_registro.save()
            fotos = []
            obj = Persona.objects.last()
            foto = obj.foto
            fotos += [cuadrada(Image.open(foto))]
            for adj in Persona._meta.get_fields():
                if 'adju' in str(adj):
                    try:
                        foto = getattr(obj, adj.attname)
                        fotos += [cuadrada(Image.open(foto))]
                    except:
                        pass
            iteraciones=5
            foto_s = aplica_itera(fotos, obj, its=iteraciones)
            f = BytesIO()
            salida = Image.new("RGBA", (2600,2600))
            try:
                marco = Image.open('/home/dario/pag_lab/static/fractalizate/marco.png')
            except:
                marco = Image.open('static/fractalizate/marco.png')
            salida = Image.new("RGBA", (2600,2600))
            marco = marco.resize((2600,2600)).convert("RGBA")
            salida.paste(marco, (0,0))
            salida.paste(foto_s, (200, 200) )
            try:
                blob = BytesIO()
                salida.save(blob, 'PNG')
                nvo_registro.foto_fractalizada.delete(save=False)
                nvo_registro.foto_fractalizada.save('Image.png', File(blob))
                nvo_registro.save()
            finally:
                f.close()
            #foto_s.save(nvo_registro.foto_fractalizada.url+'.png')
            return redirect('fractalizate:success', nvo_registro.pk)
    else:
        nvo_registro = NuevoRegistro(request.GET or None)
    return render(request, 'fractalizate/hola.html', {'nvo_registro': nvo_registro})




def v_sum(u,v):
  return (int(u[0]+v[0]), int(u[1]+v[1]))

def v_res(u,v):
  return (u[0]-v[0], u[1]-v[1])

def pit_h(u,v):
  return sqrt((u[0]-v[0])**2+(u[1]-v[1])**2)


def itera(imgs, new, v, ancho, n, i ):
    if n in [0,1]:
        return
    else:
        ancho = int(ancho/2)
        img = imgs[((i+1)//2)%len(imgs)]
        act = img.resize((ancho, ancho))
        r1 = np.sqrt(2*(3*ancho)**2)
        vi = v_res(v, (r1*cos(i*pi/4), r1*sin(i*pi/4)))
        r2 = np.sqrt(2*(3*ancho/2)**2)
        L = np.array( [pit_h(vi, (v[0]+ r2*cos(pi*(2*jj-1)/4), v[1]+r2*sin(pi*(2*jj-1)/4))) for jj in range(4)] )  #lista de distancias
        minL = list(np.where(L == L.min()))[0]    # evita la dirección más cercana a la abuela
        for l in range(4):
            j = 2*l-1
            if l == minL[0]:
                pass
            else:
                v_ent = (int(v[0]+ r2*cos(pi*j/4)), int(v[1]+ r2*sin(pi*j/4)))
                v1 = (v[0]+ r2*cos(pi*j/4), v[1]+r2*sin(pi*j/4))
                itera(imgs, new, v1, ancho, n-1, j)
                img = imgs[(((i+1)//2)+l)%len(imgs)]
                act = img.resize((ancho, ancho))
                new.paste(act, v_sum(v_ent, (-ancho/2, -ancho/2)))
        return new


def aplica_itera(imgs, obj, its=5):
    alto = 2200
    ancho = 2200
    new = Image.new("RGBA", (ancho,ancho))
    ancho = int(ancho/3)
    img = imgs[0]
    act = img.resize((ancho, ancho))
    new.paste(act, (ancho, ancho))
    ancho = int(ancho/2)   # ancho = 400
    pos = [(ancho, ancho), (ancho+ancho*3, ancho), (ancho, ancho+ancho*3), (ancho+ancho*3, ancho+ancho*3),]
    if obj.escuela:
        if int(obj.escuela[0]) < 8:
            imgs = imgs[1:]
    for word in range(4):
        img = imgs[(word)%len(imgs)]
        act = img.resize((ancho, ancho))
        new.paste(act, pos[word])
    r = np.sqrt(2*(3*ancho/2)**2)
    pi = 3.141592
    cos = np.cos
    sin = np.sin
    cx, cy = alto/2, alto/2
    for k in range(4):
        i = 2*k -1
        v = (cx+r*cos(i*pi/4),  cy+ r*sin(i*pi/4))
        #print(v)
        itera(imgs, new, v, ancho, its, i)
    return new


def cuadrada(imagen):
    img = imagen
    x = img.size[0]
    y = img.size[1]
    #print('ancho =', x, 'alto= ',y)
    if x>y:
        img = img.crop((int((x-y)/2),0,x-int((x-y)/2),y))
        img = img.resize((2200,2200))
        #print(Img.size)
    elif y>x:
        img = img.crop((0,int((y-x)/2),x,y-int((y-x)/2)))
        img = img.resize((2200,2200))
    else:
        img = img.resize((2200,2200))
    return img







def success(request, pk):
    registro = Persona.objects.get(pk=pk)
    args = {'usuario': registro, }
    registro.save()
    print(registro.foto_fractalizada, registro.foto_fractalizada.url,)
    return render(request, 'fractalizate/gracias.html' ,  args)

def descarga_tu_fractal(request, registro):
    print(registro.foto_fractalizada, registro.foto_fractalizada.url,)
    args = {'usuario': registro, }
    img = open(registro.foto_fractalizada, 'rb')
    response = FileResponse(img, as_attachment=True, content_type="image/png", )
    return response
