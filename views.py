from flask import Blueprint, render_template, request, jsonify, redirect, url_for

views = Blueprint('views', __name__)

@views.route("/")
def home():
    return render_template('home.html')

@views.route("/ocean")
def ocean():
    return render_template('ocean.html')

@views.route("/analogy-earth")
def analogyEarth():
    return render_template('earth2.html')

@views.route("/resources")
def resources():
    return render_template('resources.html')
