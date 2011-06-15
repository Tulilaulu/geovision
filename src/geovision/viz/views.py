# Create your views here.
from geovision.text_to_db.create_JSON import create_json
from django.http import HttpResponse
from django.template import Context, loader
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout

#Add '@login_required' to all these!
@login_required
def testgraph(request):
    return render_to_response("graphviz.html", { }, context_instance=RequestContext(request) )
@login_required
def graphrefresh(request): #make a new JSon, set defaults if needed
    if request.POST['bitscore'] is not None:
        bitscore = request.POST['bitscore']
    else :
        bitscore = 20
    if request.POST['e-value'] is not None:
        evalue = request.POST['e-value']
    else :
        evalue = 20        
    if request.POST['depth'] is not None:
        depth = request.POST['depth']
    else :
        depth = 20
    if request.POST['hits'] is not None:
        hits = request.POST['hits']
    else :
        hits = 20        
    create_json(0, 0, "DB1", bitscore, depth, hits)
    return render_to_response("graphviz.html", { }, context_instance=RequestContext(request) )