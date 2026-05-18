"""
Camada III — Algoritmo Genético com DEAP
Seleciona os N melhores filmes de uma lista de candidatos,
maximizando a soma dos scores fuzzy.
"""
import random
import numpy as np
from deap import base, creator, tools, algorithms
from typing import List


# Evita re-registrar se o módulo for reimportado
if not hasattr(creator, "FitnessMax"):
    creator.create("FitnessMax", base.Fitness, weights=(1.0,))
if not hasattr(creator, "Individual"):
    creator.create("Individual", list, fitness=creator.FitnessMax)


def executar_ga(filmes: List[dict], n_recomendados: int = 5,
                n_geracoes: int = 50, tamanho_pop: int = 100) -> dict:
    """
    filmes: lista de dicts com {titulo, score_fuzzy, nota}
    n_recomendados: quantos filmes selecionar
    Retorna: filmes selecionados + histórico de evolução
    """
    n_filmes = len(filmes)
    scores = [f["score_fuzzy"] for f in filmes]

    # Função objetivo: soma dos scores dos filmes selecionados
    def avaliar(individuo):
        indices_selecionados = [i for i, gene in enumerate(individuo) if gene == 1]
        if len(indices_selecionados) != n_recomendados:
            penalidade = abs(len(indices_selecionados) - n_recomendados) * 50
            soma = sum(scores[i] for i in indices_selecionados) - penalidade
        else:
            soma = sum(scores[i] for i in indices_selecionados)
        return (soma,)

    def criar_individuo():
        ind = [0] * n_filmes
        indices = random.sample(range(n_filmes), min(n_recomendados, n_filmes))
        for i in indices:
            ind[i] = 1
        return creator.Individual(ind)

    toolbox = base.Toolbox()
    toolbox.register("individual", criar_individuo)
    toolbox.register("population", tools.initRepeat, list, toolbox.individual)
    toolbox.register("evaluate", avaliar)
    toolbox.register("mate", tools.cxUniform, indpb=0.3)
    toolbox.register("mutate", tools.mutFlipBit, indpb=1.0 / n_filmes)
    toolbox.register("select", tools.selTournament, tournsize=3)

    pop = toolbox.population(n=tamanho_pop)

    fitnesses = list(map(toolbox.evaluate, pop))
    for ind, fit in zip(pop, fitnesses):
        ind.fitness.values = fit
    
    hof = tools.HallOfFame(1)
    stats = tools.Statistics(lambda ind: ind.fitness.values[0])
    stats.register("max", np.max)
    stats.register("avg", np.mean)

    historico_max = []
    historico_avg = []

    for gen in range(n_geracoes):
        offspring = algorithms.varAnd(pop, toolbox, cxpb=0.7, mutpb=0.2)
        fits = toolbox.map(toolbox.evaluate, offspring)
        for fit, ind in zip(fits, offspring):
            ind.fitness.values = fit
        pop = toolbox.select(offspring + pop, k=tamanho_pop)
        hof.update(pop)

        record = stats.compile(pop)
        historico_max.append(round(float(record["max"]), 2))
        historico_avg.append(round(float(record["avg"]), 2))

    melhor = hof[0]
    selecionados = [filmes[i] for i, gene in enumerate(melhor) if gene == 1]
    selecionados.sort(key=lambda x: x["score_fuzzy"], reverse=True)

    return {
        "filmes_recomendados": selecionados[:n_recomendados],
        "evolucao": {
            "geracoes": list(range(1, n_geracoes + 1)),
            "fitness_max": historico_max,
            "fitness_avg": historico_avg,
        },
        "fitness_final": round(historico_max[-1], 2),
    }
